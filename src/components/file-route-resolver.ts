import fs from 'node:fs/promises';
import path from 'node:path';

import { exactSlugSegment } from './dynamic-routes/exact-slug-segment';
import { catchAllSegment } from './dynamic-routes/catch-all-segment';
import { optionalCatchAllSegment } from './dynamic-routes/optional-catch-all-segment';
import { Route } from './route/route';
import { Middleware } from './route/middleware';
import { isCommonJs } from '../utils/env.utils';
import { validateFileFormat } from '../validations/validations';

import { isClass } from '../utils/common.utils';
import type { ParamExtractor } from './dynamic-routes/common/route-params-parser';
import type { Dirent } from 'node:fs';

interface Props {
  baseDir: string;
  ignoreFilesRegex?: RegExp[];
  clearImportCache: boolean;
}

interface RouteWithParams {
  route: string;
  paramExtractors: Record<string, ParamExtractor>;
}

export class FileRouteResolver {
  private static readonly fileExtensions = ['js', 'mjs', 'cjs', 'ts'].join('|');
  private static readonly fileExtensionPattern = new RegExp(
    `\\.(${FileRouteResolver.fileExtensions})$`
  );
  private static readonly middlewareFilePattern = new RegExp(
    `middleware\\.(${FileRouteResolver.fileExtensions})$`
  );
  // Matches: index.js and index.[get].js
  private static readonly indexFilePattern = new RegExp(
    `index(\\.\\[[^\\]]+\\])?\\.(${FileRouteResolver.fileExtensions})$`
  );

  private readonly baseDir: string;
  private readonly ignoreFilesRegex: RegExp[];
  private readonly clearImportCache: boolean = false;

  constructor(data: Props) {
    this.baseDir = data.baseDir;
    this.ignoreFilesRegex = data.ignoreFilesRegex || [];

    if (data.clearImportCache && !isCommonJs()) {
      console.warn('Cache clearing is only supported for CommonJS modules');
    } else {
      this.clearImportCache = data.clearImportCache;
    }
  }

  async getHandlers(
    directory = this.baseDir
  ): Promise<[Middleware[], Route[]]> {
    const [middlewares, routes] = await this.scanDirectory(directory);

    return [
      middlewares.sort((left, right) => left.nestingLevel - right.nestingLevel),
      routes.sort(this.compareByNestingLevelAndType)
    ];
  }

  private async scanDirectory(
    directory = this.baseDir,
    parentRoute = '',
    nestingLevel = 0
  ): Promise<[Middleware[], Route[]]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const routes: Route[] = [];
    const middlewares: Middleware[] = [];

    for (const entry of entries) {
      const [childMiddlewares, childRoutes] = await this.processEntry(
        directory,
        parentRoute,
        nestingLevel,
        entry
      );

      routes.push(...childRoutes);
      middlewares.push(...childMiddlewares);
    }

    return [middlewares, routes];
  }

  private async processEntry(
    directory: string,
    parentRoute: string,
    nestingLevel: number,
    entry: Dirent
  ) {
    const routes: Route[] = [];
    const middlewares: Middleware[] = [];

    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const [childMiddlewares, childRoutes] = await this.scanDirectory(
        fullPath,
        routePath,
        nestingLevel + 1
      );
      routes.push(...childRoutes);
      middlewares.push(...childMiddlewares);
    } else if (entry.isFile() && this.isValidFile(entry.name)) {
      if (FileRouteResolver.middlewareFilePattern.test(entry.name)) {
        const middleware = await this.processMiddlewareEntry(
          fullPath,
          routePath,
          nestingLevel
        );

        middlewares.push(middleware);
      } else {
        const route = await this.processFileEntry(
          fullPath,
          entry,
          routePath,
          nestingLevel
        );

        routes.push(route);
      }
    }

    return [middlewares, routes] as const;
  }

  private isValidFile(name: string): boolean {
    if (this.ignoreFilesRegex.some((pattern) => pattern.test(name))) {
      return false;
    }

    return FileRouteResolver.fileExtensionPattern.test(name);
  }

  private compareByNestingLevelAndType(left: Route, right: Route): number {
    if (left.nestingLevel !== right.nestingLevel) {
      return right.nestingLevel - left.nestingLevel;
    }

    const isDynamic = [
      optionalCatchAllSegment,
      catchAllSegment,
      exactSlugSegment
    ].some((dynamicRoute) => dynamicRoute.isMatch(left.fileName));

    return isDynamic ? 1 : -1;
  }

  private async processMiddlewareEntry(
    fullPath: string,
    filePath: string,
    nestingLevel: number
  ) {
    if (this.clearImportCache) {
      delete require.cache[fullPath];
    }

    const handler = await import(fullPath)
      .then((module) => validateFileFormat(fullPath, module))
      .then((module) => module.default);

    const routePath = filePath.replace(
      FileRouteResolver.middlewareFilePattern,
      ''
    );

    return new Middleware({
      path: routePath,
      handler,
      nestingLevel
    });
  }

  private async processFileEntry(
    fullPath: string,
    entry: Dirent,
    routePath: string,
    nestingLevel: number
  ): Promise<Route> {
    if (this.clearImportCache) {
      delete require.cache[fullPath];
    }

    const handler = await import(fullPath)
      .then((module) => validateFileFormat(fullPath, module))
      .then((module) => module.default)
      .then((FunctionOrClass) =>
        isClass(FunctionOrClass) ? new FunctionOrClass() : FunctionOrClass
      );

    const initialRoute = routePath.replace(
      FileRouteResolver.fileExtensionPattern,
      ''
    );

    const [method, pureRouteName] = this.extractMethodFromRoute(initialRoute);
    const { route, paramExtractors } = this.parseDynamicParams(pureRouteName);

    const isIndex = FileRouteResolver.indexFilePattern.test(entry.name);
    const routeKey = isIndex ? route.replace(/\/index$/, '') : route;

    const formattedUrlPath =
      (isIndex ? pureRouteName.replace(/\/index$/, '') : pureRouteName) || '/';

    return new Route({
      method,
      fileName: entry.name,
      handler,
      regex: new RegExp(`^${routeKey}/?$`),
      nestingLevel,
      paramExtractors,
      urlPath: formattedUrlPath
    });
  }

  private parseDynamicParams(initialRoute: string): RouteWithParams {
    return [exactSlugSegment, catchAllSegment, optionalCatchAllSegment]
      .filter((dynamicRoute) => dynamicRoute.isMatch(initialRoute))
      .reduce(
        (acc, route) => {
          const parsedRoute = route.parse(acc.route);
          return {
            route: parsedRoute.route,
            paramExtractors: {
              ...acc.paramExtractors,
              ...parsedRoute.paramExtractors
            }
          };
        },
        { route: initialRoute, paramExtractors: {} }
      );
  }

  private extractMethodFromRoute(route: string): [string | undefined, string] {
    const pattern = /\.\[([^\]]+)\](\..+)?$/;

    const match = route.match(pattern);
    if (!match) {
      return [undefined, route];
    }

    const [, method] = match;
    const pureRoute = route.replace(pattern, '');

    return [method, pureRoute];
  }
}
