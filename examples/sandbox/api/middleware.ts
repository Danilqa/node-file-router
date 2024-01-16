import { IncomingMessage, ServerResponse } from 'node:http';

export default async function testMiddleware(
  req: IncomingMessage,
  _: ServerResponse,
  next: () => Promise<void>
) {
  console.log(`${req.url} before root`);

  await next();
}