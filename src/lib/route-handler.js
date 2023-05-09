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
      const initialRoute = routePath.replace(/\.js$/, '');
      const pathMatch = initialRoute.match(/\[(\w+)]/g);

      const route = pathMatch ? pathMatch.reduce((accumulator, currentParam) => {
        const paramName = currentParam.slice(1, -1);
        return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>[^/]+)`);
      }, initialRoute) : initialRoute;

      const routeKey = entry.name === 'index.js' ? route.replace(/\/index$/, '') || '/' : route;
      routeHandlers[routeKey] = { handler: handler.default, regex: new RegExp(`^${routeKey}/?$`) };
    }
  };

  await Promise.all(entries.map(processEntry));

  return routeHandlers;
}
