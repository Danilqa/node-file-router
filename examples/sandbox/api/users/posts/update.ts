import { ServerResponse, IncomingMessage } from 'node:http';

export default function updateHandler(_: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.end('update');
}
