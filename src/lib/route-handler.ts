import fs from 'node:fs/promises';
import path from 'node:path';
import { decodeSlugParam } from './slug-param/slug-param';
import { exactSlugRoute } from './routes/exact-slug-route';
import { catchAllRoute } from './routes/catch-all-route';
import { filterValues, mapKeys, mapValues } from '../utils/object.utils';
import { pipe } from '../utils/fp.utils';
import { optionalCatchAllRoute } from './routes/optional-catch-all-route';

const fileExtensions = ['js', 'mjs', 'cjs', 'ts'].join('|');
const fileExtensionPattern = new RegExp(`\\.(${fileExtensions})$`);
const indexFilePattern = new RegExp(`index\\.(${fileExtensions})$`);

export async function getRouteHandlers(directory, parentRoute = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routeHandlers = {};

  const processEntry = async (entry) => {
    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const childHandlers = await getRouteHandlers(fullPath, routePath);
      Object.assign(routeHandlers, childHandlers);
    } else if (entry.isFile() && fileExtensionPattern.test(entry.name)) {
      const handler = await import(fullPath);
      const initialRoute = routePath.replace(fileExtensionPattern, '');

      const dynamicRoute = [exactSlugRoute, catchAllRoute, optionalCatchAllRoute].find(route => route.isMatch(initialRoute));
      const route = dynamicRoute?.get(initialRoute) || initialRoute;
      const routeKey = indexFilePattern.test(entry.name) ? route.replace(/\/index$/, '') || '/' : route;

      routeHandlers[routeKey] = createRouteHandler({ handler, routeKey });
    }
  };

  await Promise.all(entries.map(processEntry));

  return routeHandlers;
}

function createRouteHandler({ handler, routeKey }) {
  const regex = new RegExp(`^${routeKey}/?$`);

  function getQueryParams(pathname) {
    const rawQueryParams = regex.exec(pathname).groups || {};

    return pipe(
      mapKeys(decodeSlugParam),
      mapValues(value => value.includes('/') ? value.split('/') : value),
      filterValues(Boolean)
    )(rawQueryParams);
  }

  return {
    handler: handler.default,
    regex,
    getQueryParams
  };
}
