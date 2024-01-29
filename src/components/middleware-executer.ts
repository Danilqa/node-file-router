import type { RequestHandler } from '../types/request-handlers';
import type { Dictionary } from '../types/dictionary';

export async function executeWithMiddlewares<R>(
  middlewares: RequestHandler[],
  fileRouteHandler: RequestHandler,
  args: unknown[],
  routeParams?: Dictionary<string>
) {
  const handlersQueue = [...middlewares, fileRouteHandler];

  const results: (R | undefined | void)[] = [];
  async function processNext(i = 0): Promise<void> {
    const isMiddlewareHandler = i < handlersQueue.length - 1;
    const isRouteHandler = i === handlersQueue.length - 1;

    if (isMiddlewareHandler) {
      results[i] = await handlersQueue[i](
        ...args,
        () => processNext(i + 1),
        routeParams
      );
    } else if (isRouteHandler) {
      results[i] = await handlersQueue[i](...args, routeParams);
    }
  }

  await processNext();

  // Returns the result of the last successful handler in the chain,
  // not from the first in the call stack.
  return results.pop();
}
