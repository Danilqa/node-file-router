import type { ServerResponse, IncomingMessage } from 'node:http';

async function middlewareA(
  // @ts-ignore
  req: IncomingMessage,
  // @ts-ignore
  res: ServerResponse,
  next: () => Promise<void>
) {
  console.log('before a');

  await next();

  console.log('after a');
}

async function middlewareB(
  // @ts-ignore
  req: IncomingMessage,
  // @ts-ignore
  res: ServerResponse,
  next: () => Promise<void>
) {
  console.log('before b');

  await next();

  console.log('after b');
}

function superHandler(_: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.end('super');
}

export default [
  middlewareA,
  middlewareB,
  superHandler,
];
