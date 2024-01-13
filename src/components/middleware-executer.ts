import type { RequestHandler } from '../types/request-handler';

type MiddlewareHandler = (...args: any[]) => Promise<any>;

export async function executeWithMiddlewares(
  middlewares: MiddlewareHandler[],
  nextRouteHandler: RequestHandler,
  ...initialArgs: unknown[]
) {
  const queue = [...middlewares, nextRouteHandler];
  let index = 0;

  const results: any[] = [];
  const next = async () => {
    if (index < queue.length) {
      const currentIndex = index;
      index += 1;
      results[index] = await queue[currentIndex](...initialArgs, next);
    }
  };

  await next();

  return results.pop();
}
