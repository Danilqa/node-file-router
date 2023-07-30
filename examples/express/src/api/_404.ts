import type { IncomingMessage, ServerResponse } from 'node:http';

export default function notFoundHandler(
  _: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');
  res.end('404');
}
