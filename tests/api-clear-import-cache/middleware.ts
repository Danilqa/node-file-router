import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function testMiddleware(
  _: IncomingMessage,
  __: ServerResponse,
  next: () => Promise<void>
) {
  await next();
}
