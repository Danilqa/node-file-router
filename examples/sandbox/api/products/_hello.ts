import { IncomingMessage, ServerResponse } from 'node:http';

export default function productsHandler(_: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.end('_hello');
}
