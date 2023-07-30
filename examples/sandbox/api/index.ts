import type { IncomingMessage, ServerResponse } from 'node:http';

export default function indexHandler(_: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello!</h1>');
}
