import fs from 'node:fs/promises';
import path from 'node:path';
import { encodeSlugParam } from './slug-param/slug-param.js';

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
      let route = routePath.replace(/\.js$/, '');

      const pathMatch = route.match(/\[(\w+)]/g);
      if (pathMatch) {
        route = pathMatch.reduce((accumulator, currentParam) => {
          const paramName = currentParam.slice(1, -1);
          return accumulator.replace(`[${paramName}]`, `(?<${encodeSlugParam(paramName)}>[^/]+)`);
        }, route);
      }

      if (entry.name === 'index.js') {
        const indexRoute = route.replace(/\/index$/, '') || '/';
        routeHandlers[indexRoute] = { handler: handler.default, regex: new RegExp(`^${indexRoute}/?$`) };
      } else {
        routeHandlers[route] = { handler: handler.default, regex: new RegExp(`^${route}/?$`) };
      }
    }
  };

  await Promise.all(entries.map(processEntry));

  return routeHandlers;
}
