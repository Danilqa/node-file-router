import type { RequestHandler } from '../types/request-handler';

export async function executeWithMiddlewares<R>(
  middlewares: RequestHandler[],
  fileRouteHandler: RequestHandler,
  args: unknown[]
) {
  const handlersQueue = [...middlewares, fileRouteHandler];

  const results: (R | undefined | void)[] = [];
  async function processNext(index = 0): Promise<void> {
    if (index < handlersQueue.length) {
      results[index] = await handlersQueue[index](...args, () =>
        processNext(index + 1)
      );
    }
  }

  await processNext();

  // Returns the result of the last successful handler in the chain,
  // not from the first in the call stack.
  return results.pop();
}
