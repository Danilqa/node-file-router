import fs from 'node:fs/promises';
import path from 'node:path';

import { exactSlugSegment } from './dynamic-routes/exact-slug-segment';
import { catchAllSegment } from './dynamic-routes/catch-all-segment';
import { optionalCatchAllSegment } from './dynamic-routes/optional-catch-all-segment';
import { RouteHandler } from './route-handler/route-handler';
import { validateFileFormat } from '../validations/validations';
import type { ParamExtractor } from './dynamic-routes/common/route-params-parser';
import type { Dirent } from 'node:fs';

interface Props {
  baseDir: string;
  ignoreFilesRegex?: RegExp[];
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
  // Matches: index.js and index.[get].js
  private static readonly indexFilePattern = new RegExp(
    `index(\\.\\[[^\\]]+\\])?\\.(${FileRouteResolver.fileExtensions})$`
  );

  private readonly baseDir: string;
  private readonly ignoreFilesRegex: RegExp[];

  constructor(data: Props) {
    this.baseDir = data.baseDir;
    this.ignoreFilesRegex = data.ignoreFilesRegex || [];
  }

  async getHandlers(directory = this.baseDir): Promise<RouteHandler[]> {
    return this.scanDirectory(directory).then((handlers) =>
      handlers.sort(this.compareByNestingLevelAndType)
    );
  }

  private async scanDirectory(
    directory = this.baseDir,
    parentRoute = '',
    nestingLevel = 0
  ): Promise<RouteHandler[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const routeHandlers: RouteHandler[] = [];

    const processEntry = async (entry: Dirent) => {
      const fullPath = path.join(directory, entry.name);
      const routePath = `${parentRoute}/${entry.name}`;

      if (entry.isDirectory()) {
        const childHandlers = await this.scanDirectory(
          fullPath,
          routePath,
          nestingLevel + 1
        );
        routeHandlers.push(...childHandlers);
      } else if (entry.isFile() && this.isValidFile(entry.name)) {
        const routeHandler = await this.processFileEntry(
          fullPath,
          entry,
          routePath,
          nestingLevel
        );
        routeHandlers.push(routeHandler);
      }
    };

    for (const entry of entries) {
      await processEntry(entry);
    }

    return routeHandlers;
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

  private async processFileEntry(
    fullPath: string,
    entry: Dirent,
    routePath: string,
    nestingLevel: number
  ): Promise<RouteHandler> {
    const handler = await import(fullPath)
      .then((module) => validateFileFormat(fullPath, module))
      .then((module) => module.default);

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
      fullPath,
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
