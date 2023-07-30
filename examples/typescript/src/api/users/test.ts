import type { ServerResponse, IncomingMessage } from 'node:http';

export default function testHandler(_: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.end('test');
}
