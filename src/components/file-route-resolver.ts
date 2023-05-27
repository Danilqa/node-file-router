import fs from 'node:fs/promises';
import path from 'node:path';
import { Dirent } from 'node:fs';

import { exactSlugRoute } from './dynamic-routes/exact-slug-route';
import { catchAllRoute } from './dynamic-routes/catch-all-route';
import { optionalCatchAllRoute } from './dynamic-routes/optional-catch-all-route';
import { FileRoute } from './file-route/file-route';
import { filterValues, mapKeys, mapValues } from '../utils/object.utils';
import { pipe } from '../utils/fp.utils';
import { decodeSlugParam } from './slug-param/slug-param';
import { ParamsGetter } from './dynamic-routes/common/route-params-parser';

const fileExtensions = ['js', 'mjs', 'cjs', 'ts'].join('|');
const fileExtensionPattern = new RegExp(`\\.(${fileExtensions})$`);
const indexFilePattern = new RegExp(`index\\.(${fileExtensions})$`);

interface DynamicRoute {
  routeKey: string;
  routeParams: Record<string, ParamsGetter>;
}

export async function resolveFileRoutes(directory: string, parentRoute = '', weight = 0): Promise<Record<string, FileRoute>> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routeHandlers: Record<string, FileRoute> = {};

  const processEntry = async (entry: Dirent) => {
    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const childHandlers = await resolveFileRoutes(fullPath, routePath, weight + 1);
      Object.assign(routeHandlers, childHandlers);
    } else if (entry.isFile() && fileExtensionPattern.test(entry.name)) {
      const handler = await import(fullPath).then(module => module.default);
      const initialRoute = routePath.replace(fileExtensionPattern, '');

      const parsedDynamicRoute: DynamicRoute = [exactSlugRoute, catchAllRoute, optionalCatchAllRoute]
          .filter(dynamicRoute => dynamicRoute.isMatch(initialRoute))
          .reduce((acc, route) => {
            const parsedRoute = route.parseRoute(acc.routeKey);
            return {
              routeKey: parsedRoute.route,
              routeParams: { ...acc.routeParams, ...parsedRoute.params }
            };

          }, { routeKey: initialRoute, routeParams: {} });

      const route = parsedDynamicRoute.routeKey || initialRoute;
      const isIndex = new RegExp(indexFilePattern).test(entry.name);
      const routeKey = isIndex ? route.replace(/\/index$/, '') || '/' : route;

      const regex = new RegExp(`^${routeKey}/?$`);

      routeHandlers[routeKey] = {
        fileName: entry.name,
        handler,
        regex,
        weight,
        getRouteParams: pathname => {
          const groups = new RegExp(regex).exec(pathname)?.groups || {};
          return pipe(
              filterValues<string>(Boolean),
              mapValues<string, string | string[]>((group, key) => (parsedDynamicRoute.routeParams)[key](group)),
              mapKeys(decodeSlugParam),
          )(groups);
        },
      };
    }
  };

  await Promise.all(entries.map(processEntry));

  return routeHandlers;
}
