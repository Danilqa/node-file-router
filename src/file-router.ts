import { URL } from 'node:url';
import * as path from 'node:path';
import { getRouteHandlers } from './lib/route-handler';
import { isFunction, isObject } from './utils/object.utils';
import { withoutTrailingSlashes } from './utils/string.utils';

export async function initFileRouter({ baseDir = '/api' } = {}) {
  const basePath = path.join(process.cwd(), baseDir);

  const routeHandlers = await getRouteHandlers(basePath);
  const notFoundHandler = await import(path.join(basePath, '_404.js'))
    .catch(() => import('./lib/default-not-found'));

  return function requestHandler(req, res) {
    const parsedUrl = new URL(withoutTrailingSlashes(req.url), `https://${req.headers.host}`);
    const { searchParams, pathname } = parsedUrl;
    const matchedRoute = Object.values(routeHandlers).find(({ regex }) => regex.test(pathname));
    if (!matchedRoute) {
      notFoundHandler.default(req, res);
      return;
    }

    // @ts-ignore
    const { handler, getQueryParams } = matchedRoute;
    req.query = { ...Object.fromEntries(searchParams), ...getQueryParams(pathname) };

    const method = req.method?.toLowerCase();
    if (isObject(handler) && handler[method]) {
      handler[method](req, res);
    } else if (isFunction(handler)) {
      handler(req, res);
    } else {
      notFoundHandler.default(req, res);
    }
  }
}