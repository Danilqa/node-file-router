import fs from 'node:fs/promises';
import path from 'node:path';
import { decodeSlugParam } from './slug-param/slug-param.js';
import { exactSlugRoute } from './routes/exact-slug-route.js';
import { catchAllRoute } from './routes/catch-all-route.js';
import { filterValues, mapKeys, mapValues } from '../utils/object.utils.js';
import { pipe } from '../utils/fp.utils.js';
import { optionalCatchAllRoute } from './routes/optional-catch-all-route.js';

export async function getRouteHandlers(directory, parentRoute = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routeHandlers = {};

  const processEntry = async (entry) => {
    const fullPath = path.join(directory, entry.name);
    const routePath = `${parentRoute}/${entry.name}`;

    if (entry.isDirectory()) {
      const childHandlers = await getRouteHandlers(fullPath, routePath);
      Object.assign(routeHandlers, childHandlers);
    } else if (entry.isFile() && path.extname(entry.name) === '.js') {
      const handler = await import(fullPath);
      const initialRoute = routePath.replace(/\.js$/, '');

      const dynamicRoute = [exactSlugRoute, catchAllRoute, optionalCatchAllRoute].find(route => route.isMatch(initialRoute));
      const route = dynamicRoute?.get(initialRoute) || initialRoute;
      console.log('route:', route);
      const routeKey = entry.name === 'index.js' ? route.replace(/\/index$/, '') || '/' : route;

      routeHandlers[routeKey] = createRouteHandler({ handler, routeKey });
    }
  };

  await Promise.all(entries.map(processEntry));

  console.log(routeHandlers);

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
