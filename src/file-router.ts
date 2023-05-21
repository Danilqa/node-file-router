import { URL } from 'node:url';
import * as path from 'node:path';
import { IncomingMessage, ServerResponse } from 'node:http';

import { resolveFileRoutes } from './components/file-route-resolver';
import { isFunction, isRecordWith } from './utils/object.utils';
import { withoutTrailingSlashes } from './utils/string.utils';
import { resolveNotFoundHandler } from './components/not-found-resolver';
import { Request } from './types/request';

export async function initFileRouter({ baseDir = '/api' } = {}) {
  const basePath = path.join(process.cwd(), baseDir);

  const routeHandlers = await resolveFileRoutes(basePath);
  const notFoundHandler = await resolveNotFoundHandler(basePath);

  return function requestHandler(req: IncomingMessage, res: ServerResponse) {
    const parsedUrl = new URL(withoutTrailingSlashes(req.url || ''), `https://${req.headers.host}`);
    const { searchParams, pathname } = parsedUrl;
    const matchedRoute = Object.values(routeHandlers).find(({ regex }) => regex.test(pathname));
    if (!matchedRoute) {
      notFoundHandler.default(req, res);
      return;
    }

    const { handler, getQueryParams } = matchedRoute;

    (req as Request).query = { ...Object.fromEntries(searchParams), ...getQueryParams(pathname) };

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
