import { IncomingMessage, ServerResponse } from 'node:http';

export default async function testMiddleware(
  // @ts-ignore
  req: IncomingMessage,
  // @ts-ignore
  res: ServerResponse,
  next: () => Promise<void>
) {
  console.log('before ololo');

  await next();

  console.log('after ololo');
}