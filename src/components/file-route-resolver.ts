import fs from 'node:fs/promises';
import path from 'node:path';

import { exactSlugSegment } from './dynamic-routes/exact-slug-segment';
import { catchAllSegment } from './dynamic-routes/catch-all-segment';
import { optionalCatchAllSegment } from './dynamic-routes/optional-catch-all-segment';
import { RouteHandler } from './route-handler/route-handler';
import { MiddlewareHandler } from './route-handler/middleware-handler';
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
  ): Promise<[MiddlewareHandler[], RouteHandler[]]> {
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
  ): Promise<[MiddlewareHandler[], RouteHandler[]]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const routeHandlers: RouteHandler[] = [];
    const middlewareHandlers: MiddlewareHandler[] = [];

    for (const entry of entries) {
      const [middlewares, routes] = await this.processEntry(
        directory,
        parentRoute,
        nestingLevel,
        entry
      );

      routeHandlers.push(...routes);
      middlewareHandlers.push(...middlewares);
    }

    return [middlewareHandlers, routeHandlers];
  }

  private async processEntry(
    directory: string,
    parentRoute: string,
    nestingLevel: number,
    entry: Dirent
  ) {
    const routeHandlers: RouteHandler[] = [];
    const middlewareHandlers: MiddlewareHandler[] = [];

    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const [childMiddlewareHandlers, childHandlers] = await this.scanDirectory(
        fullPath,
        routePath,
        nestingLevel + 1
      );
      routeHandlers.push(...childHandlers);
      middlewareHandlers.push(...childMiddlewareHandlers);
    } else if (entry.isFile() && this.isValidFile(entry.name)) {
      if (FileRouteResolver.middlewareFilePattern.test(entry.name)) {
        const middlewareHandler = await this.processMiddlewareEntry(
          fullPath,
          routePath,
          nestingLevel
        );

        middlewareHandlers.push(middlewareHandler);
      } else {
        const routeHandler = await this.processFileEntry(
          fullPath,
          entry,
          routePath,
          nestingLevel
        );

        routeHandlers.push(routeHandler);
      }
    }

    return [middlewareHandlers, routeHandlers] as const;
  }

  private isValidFile(name: string): boolean {
    if (this.ignoreFilesRegex.some((pattern) => pattern.test(name))) {
      return false;
    }

    return FileRouteResolver.fileExtensionPattern.test(name);
  }

  private compareByNestingLevelAndType(
    left: RouteHandler,
    right: RouteHandler
  ): number {
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

    return new MiddlewareHandler({
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
  ): Promise<RouteHandler> {
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

    const regex = new RegExp(`^${routeKey}/?$`);

    return new RouteHandler({
      method,
      fileName: entry.name,
      handler,
      regex,
      nestingLevel,
      paramExtractors
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
