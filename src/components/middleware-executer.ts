import type { RequestHandler } from '../types/request-handlers';
import type { Dictionary } from '../types/dictionary';

type Result<R> = R | undefined | void;

export async function executeWithMiddlewares<R>(
  middlewares: RequestHandler[],
  fileRouteHandler: RequestHandler,
  args: unknown[],
  routeParams?: Dictionary<string>
) {
  const handlersQueue = [...middlewares, fileRouteHandler];

  const results: Result<R>[] = [];
  async function processNext(i = 0): Promise<Result<R>> {
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

    return results[i];
  }

  await processNext();

  // Returns the result of the first middleware that returns a value
  return results.find((res) => res !== undefined);
}
