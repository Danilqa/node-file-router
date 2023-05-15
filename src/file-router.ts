import { URL } from 'node:url';
import * as path from 'node:path';
import { ServerResponse } from 'node:http';

import { resolveFileRoutes } from './components/file-route-resolver';
import { isFunction, isRecordWith } from './utils/object.utils';
import { withoutTrailingSlashes } from './utils/string.utils';
import { Request } from "./types/request";

export async function initFileRouter({ baseDir = '/api' } = {}) {
  const basePath = path.join(process.cwd(), baseDir);

  const routeHandlers = await resolveFileRoutes(basePath);
  const notFoundHandler = await import(path.join(basePath, '_404.js'))
    .catch(() => import('./components/default-not-found'));

  return function requestHandler(req: Request, res: ServerResponse) {
    const parsedUrl = new URL(withoutTrailingSlashes(req.url), `https://${req.headers.host}`);
    const { searchParams, pathname } = parsedUrl;
    const matchedRoute = Object.values(routeHandlers).find(({ regex }) => regex.test(pathname));
    if (!matchedRoute) {
      notFoundHandler.default(req, res);
      return;
    }

    const { handler, getQueryParams } = matchedRoute;
    req.query = { ...Object.fromEntries(searchParams), ...getQueryParams(pathname) };

    const method = req.method?.toLowerCase();
    if (isRecordWith<Function>(handler) && method && handler[method]) {
      handler[method](req, res);
    } else if (isFunction(handler)) {
      handler(req, res);
    } else {
      notFoundHandler.default(req, res);
    }
  }
}
