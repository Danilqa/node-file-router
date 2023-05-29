import { URL } from 'node:url';
import * as path from 'node:path';
import { IncomingMessage, ServerResponse } from 'node:http';

import { FileRouteResolver } from './components/file-route-resolver';
import { isFunction, isRecordWith } from './utils/object.utils';
import { withoutTrailingSlashes } from './utils/string.utils';
import { resolveNotFoundHandler } from './components/not-found-resolver';

interface Options {
  baseDir?: string;
  ignoreFilesRegex?: RegExp[];
}

export async function initFileRouter({ baseDir = path.join(process.cwd(), '/api'), ignoreFilesRegex }: Options) {
  const fileRouteResolver = new FileRouteResolver({ baseDir, ignoreFilesRegex });

  const routeHandlers = await fileRouteResolver.getHandlers();
  const notFoundHandler = await resolveNotFoundHandler(baseDir);

  return function requestHandler(req: IncomingMessage, res: ServerResponse) {
    const parsedUrl = new URL(withoutTrailingSlashes(req.url || ''), `https://${req.headers.host}`);
    const { pathname } = parsedUrl;
    const matchedRoute = routeHandlers.find(({ regex }) => regex.test(pathname))
    if (!matchedRoute) {
      notFoundHandler.default(req, res);
      return;
    }

    const { handler } = matchedRoute;

    const routeParams = matchedRoute.getRouteParams(pathname);
    const method = req.method?.toLowerCase();
    if (isRecordWith<Function>(handler) && method && handler[method]) {
      handler[method](req, res, routeParams);
    } else if (isFunction(handler)) {
      handler(req, res, routeParams);
    } else {
      notFoundHandler.default(req, res, routeParams);
    }
  }
}
