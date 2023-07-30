import type { IncomingMessage, ServerResponse } from 'node:http';

export default function defaultNotFoundHandler(
  _: IncomingMessage,
  res: ServerResponse
) {
  res.end('404 Not Found');
}
