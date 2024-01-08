import type { RequestHandler } from '../types/request-handler';

type MiddlewareHandler = (...args: unknown[]) => Promise<unknown>;

export async function executeWithMiddlewares(
  middlewares: MiddlewareHandler[],
  nextRouteHandler: RequestHandler,
  ...initialArgs: unknown[]
) {
  const queue = [...middlewares, nextRouteHandler];
  let index = 0;

  const next = async () => {
    if (index < queue.length) {
      const currentIndex = index;
      index += 1;
      await queue[currentIndex](...initialArgs, next);
    }
  };

  await next();
}
