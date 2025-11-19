import * as path from 'node:path';
import * as process from 'node:process';

import { FileRouteResolver } from './components/file-route-resolver';
import { isFunction, isRecordWith } from './utils/object.utils';
import { resolveNotFoundHandler } from './components/not-found-resolver';
import { httpAdapter } from './adapters/http-adapter';
import { validateBaseDirExistence } from './validations/validations';
import { executeWithMiddlewares } from './components/middleware-executer';

import type { RequestHandler } from './types/request-handlers';
import type { Adapter } from './types/adapter';
import type { Route } from './components/route/route';
import type { Dictionary } from './types/dictionary';

interface InitParams {
  routes: Route[];
}

interface Options {
  baseDir?: string;
  ignoreFilesRegex?: RegExp[];
  adapter?: Adapter;
  clearImportCache?: boolean;
  onInit?: (params: InitParams) => void;
}

export async function initFileRouter({
  baseDir = 'api',
  ignoreFilesRegex,
  clearImportCache = false,
  adapter = httpAdapter,
  onInit
}: Options = {}) {
  const { getPathname, defaultNotFoundHandler, getMethod } = adapter;

  const normalizedBaseDir = path.isAbsolute(baseDir)
    ? baseDir
    : path.join(process.cwd(), baseDir);

  await validateBaseDirExistence(normalizedBaseDir);

  const fileRouteResolver = new FileRouteResolver({
    baseDir: normalizedBaseDir,
    ignoreFilesRegex,
    clearImportCache
  });

  const [middlewares, routeHandlers] = await fileRouteResolver.getHandlers();
  const notFoundHandler =
    (await resolveNotFoundHandler(normalizedBaseDir)) || defaultNotFoundHandler;

  function extractMiddlewares(pathname: string, matchedRoute?: Route) {
    let matched = middlewares;

    if (matchedRoute) {
      const allowedPaths = new Set(matchedRoute.directoryPaths);
      matched = middlewares.filter(({ path: middlewarePath }) =>
        allowedPaths.has(middlewarePath)
      );
    } else {
      matched = middlewares.filter(({ regexp }) => regexp.test(pathname));
    }

    return matched.flatMap(({ handler }) =>
      Array.isArray(handler) ? handler : [handler]
    );
  }

  function matchRoute(pathname: string, method: string | undefined) {
    return routeHandlers.find(
      ({ regex, method: routeMethod }) =>
        regex.test(pathname) && (!routeMethod || method === routeMethod)
    );
  }

  function runHandler<R>(
    method: string | undefined,
    args: unknown[],
    matchedRoute?: Route,
    routeParams?: Dictionary<string>
  ) {
    if (!matchedRoute) {
      return notFoundHandler(...args);
    }

    const { handler } = matchedRoute;

    if (isRecordWith<RequestHandler>(handler) && method && handler[method]) {
      return handler[method](...args, routeParams);
    }

    if (isFunction(handler)) {
      return handler(...args, routeParams);
    }

    if (Array.isArray(handler)) {
      const [routeMiddlewares, routeHandler] = [
        handler.slice(0, -1),
        handler.at(-1)
      ];

      return executeWithMiddlewares<R>(
        routeMiddlewares,
        routeHandler,
        args,
        routeParams
      );
    }

    return notFoundHandler(...args, routeParams);
  }

  if (onInit) {
    onInit({ routes: routeHandlers });
  }

  return function requestHandler<R>(...args: unknown[]) {
    const pathname = getPathname(...args);
    const method = getMethod ? getMethod(...args) : undefined;
    const matchedRoute = matchRoute(pathname, method);
    const routeParams = matchedRoute?.getRouteParams(pathname);
    const matchedMiddlewares = extractMiddlewares(pathname, matchedRoute);

    return executeWithMiddlewares<R>(
      matchedMiddlewares,
      () => runHandler<R>(method, args, matchedRoute, routeParams),
      args,
      routeParams
    );
  };
}
