import * as path from 'node:path';
import * as process from 'node:process';

import { FileRouteResolver } from './components/file-route-resolver';
import { isFunction, isRecordWith } from './utils/object.utils';
import { resolveNotFoundHandler } from './components/not-found-resolver';
import { httpAdapter } from './adapters/http-adapter';
import { validateBaseDirExistence } from './validations/validations';
import type { Adapter } from './types/adapter';
import type { RequestHandler } from './types/request-handler';

interface Options {
  baseDir?: string;
  ignoreFilesRegex?: RegExp[];
  adapter?: Adapter;
}

export async function initFileRouter({
  baseDir = 'api',
  ignoreFilesRegex,
  adapter = httpAdapter
}: Options = {}) {
  const { getPathname, defaultNotFoundHandler, getMethod } = adapter;

  const normalizedBaseDir = path.isAbsolute(baseDir)
    ? baseDir
    : path.join(process.cwd(), baseDir);

  await validateBaseDirExistence(normalizedBaseDir);

  const fileRouteResolver = new FileRouteResolver({
    baseDir: normalizedBaseDir,
    ignoreFilesRegex
  });

  const routeHandlers = await fileRouteResolver.getHandlers();

  const notFoundHandler =
    (await resolveNotFoundHandler(normalizedBaseDir)) || defaultNotFoundHandler;

  return function requestHandler(...args: unknown[]) {
    const pathname = getPathname(...args);

    const method = getMethod && getMethod(...args);
    const matchedRoute = routeHandlers.find(
      ({ regex, method: routeMethod }) =>
        regex.test(pathname) && (!routeMethod || method === routeMethod)
    );
    if (!matchedRoute) {
      return notFoundHandler(...args);
    }

    const { handler } = matchedRoute;
    const routeParams = matchedRoute.getRouteParams(pathname);
    if (isRecordWith<RequestHandler>(handler) && method && handler[method]) {
      return handler[method](...args, routeParams);
    }

    if (isFunction(handler)) {
      return handler(...args, routeParams);
    }

    return notFoundHandler(...args, routeParams);
  };
}
