import { IncomingMessage, ServerResponse } from 'node:http';

export default async function testMiddleware(
  // @ts-ignore
  req: IncomingMessage,
  // @ts-ignore
  res: ServerResponse,
  next: () => Promise<void>
) {
  console.log(`${req.url} before root`);

  await next();

  console.log(`${req.url}  after root`);
}