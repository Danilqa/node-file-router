import fs from 'node:fs/promises';
import path from 'node:path';
import { Dirent } from 'node:fs';

import { exactSlugRoute } from './dynamic-routes/exact-slug-route';
import { catchAllRoute } from './dynamic-routes/catch-all-route';
import { optionalCatchAllRoute } from './dynamic-routes/optional-catch-all-route';
import { FileRoute } from './file-route/file-route';

const fileExtensions = ['js', 'mjs', 'cjs', 'ts'].join('|');
const fileExtensionPattern = new RegExp(`\\.(${fileExtensions})$`);
const indexFilePattern = new RegExp(`index\\.(${fileExtensions})$`);

export async function resolveFileRoutes(directory: string, parentRoute = ''): Promise<Record<string, FileRoute>> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routeHandlers: Record<string, FileRoute> = {};

  const processEntry = async (entry: Dirent) => {
    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const childHandlers = await resolveFileRoutes(fullPath, routePath);
      Object.assign(routeHandlers, childHandlers);
    } else if (entry.isFile() && fileExtensionPattern.test(entry.name)) {
      const handler = await import(fullPath).then(module => module.default);
      const initialRoute = routePath.replace(fileExtensionPattern, '');

      const dynamicRoute = [exactSlugRoute, catchAllRoute, optionalCatchAllRoute].find(route => route.isMatch(initialRoute));
      const route = dynamicRoute?.get(initialRoute) || initialRoute;
      const routeKey = indexFilePattern.test(entry.name) ? route.replace(/\/index$/, '') || '/' : route;

      const regex = new RegExp(`^${routeKey}/?$`);
      routeHandlers[routeKey] = {
        handler,
        regex,
        getRouteParams: dynamicRoute?.getRouteParams?.(regex) || (() => ({}))
      };
    }
  };

  await Promise.all(entries.map(processEntry));

  return routeHandlers;
}
