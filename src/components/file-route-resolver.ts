import fs from 'node:fs/promises';
import path from 'node:path';
import { Dirent } from 'node:fs';

import { exactSlugSegment } from './dynamic-routes/exact-slug-segment';
import { catchAllSegment } from './dynamic-routes/catch-all-segment';
import { optionalCatchAllSegment } from './dynamic-routes/optional-catch-all-segment';
import { ParamExtractor } from './dynamic-routes/common/route-params-parser';
import { RouteHandler } from './route-handler/route-handler';

const fileExtensions = ['js', 'mjs', 'cjs', 'ts'].join('|');
const fileExtensionPattern = new RegExp(`\\.(${fileExtensions})$`);
const indexFilePattern = new RegExp(`index\\.(${fileExtensions})$`);

interface RouteWithParams {
  route: string;
  paramExtractors: Record<string, ParamExtractor>;
}

export async function resolveFileRoutes(directory: string, parentRoute = '', nestingLevel = 0): Promise<RouteHandler[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routeHandlers: RouteHandler[] = [];

  const processEntry = async (entry: Dirent) => {
    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const childHandlers = await resolveFileRoutes(fullPath, routePath, nestingLevel + 1);
      routeHandlers.push(...childHandlers);
    } else if (entry.isFile() && fileExtensionPattern.test(entry.name)) {
      const routeHandler = await processFileEntry(fullPath, entry, routePath, nestingLevel);
      routeHandlers.push(routeHandler);
    }
  };

  await Promise.all(entries.map(processEntry));

  routeHandlers.sort(compareByNestingLevelAndType);

  return routeHandlers;
}

function compareByNestingLevelAndType(left: RouteHandler, right: RouteHandler) {
  if (left.nestingLevel !== right.nestingLevel) {
    return right.nestingLevel - left.nestingLevel;
  }

  const isDynamic = [
    optionalCatchAllSegment,
    catchAllSegment,
    exactSlugSegment
  ].some(dynamicRoute => dynamicRoute.isMatch(left.fileName));

  return isDynamic ? 1 : -1;
}

async function processFileEntry(fullPath: string, entry: Dirent, routePath: string, nestingLevel: number): Promise<RouteHandler> {
  const handler = await import(fullPath).then(module => module.default);
  const initialRoute = routePath.replace(fileExtensionPattern, '');

  const { route, paramExtractors } = parseDynamicParams(initialRoute);

  const isIndex = indexFilePattern.test(entry.name);
  const routeKey = isIndex ? route.replace(/\/index$/, '') : route;

  const regex = new RegExp(`^${routeKey}/?$`);

  return new RouteHandler({
    fileName: entry.name,
    handler,
    regex,
    nestingLevel,
    paramExtractors,
  });
}

function parseDynamicParams(initialRoute: string): RouteWithParams {
  return [exactSlugSegment, catchAllSegment, optionalCatchAllSegment]
      .filter(dynamicRoute => dynamicRoute.isMatch(initialRoute))
      .reduce((acc, route) => {
        const parsedRoute = route.parse(acc.route);
        return {
          route: parsedRoute.route,
          paramExtractors: { ...acc.paramExtractors, ...parsedRoute.paramExtractors }
        };
      }, { route: initialRoute, paramExtractors: {} });
}
