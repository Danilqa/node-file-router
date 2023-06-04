import * as path from 'node:path';

import { FileRouteResolver } from './components/file-route-resolver';
import { isFunction, isRecordWith } from './utils/object.utils';
import { resolveNotFoundHandler } from './components/not-found-resolver';
import { Adapter } from './types/adapter';
import { httpAdapter } from './adapters/http-adapter';

interface Options {
  baseDir?: string;
  ignoreFilesRegex?: RegExp[];
  adapter?: Adapter;
}

export async function initFileRouter({
    baseDir = path.join(process.cwd(), '/api'),
    ignoreFilesRegex,
    adapter = httpAdapter
}: Options) {
  const { getPathname, defaultNotFoundHandler, getMethod } = adapter;
  const fileRouteResolver = new FileRouteResolver({ baseDir, ignoreFilesRegex });

  const routeHandlers = await fileRouteResolver.getHandlers();
  const notFoundHandler = await resolveNotFoundHandler(baseDir) || defaultNotFoundHandler;
  return function requestHandler(...args: unknown[]) {
    const pathname = getPathname(...args);

    const matchedRoute = routeHandlers.find(({ regex }) => regex.test(pathname))
    if (!matchedRoute) {
      notFoundHandler(...args);
      return;
    }

    const { handler } = matchedRoute;

    const routeParams = matchedRoute.getRouteParams(pathname);

    const method = getMethod && getMethod(...args);
    if (isRecordWith<Function>(handler) && method && handler[method]) {
      handler[method](...args, routeParams);
    } else if (isFunction(handler)) {
      handler(...args, routeParams);
    } else {
      notFoundHandler.default(...args, routeParams);
    }
  }
}
