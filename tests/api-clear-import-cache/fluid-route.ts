import type { IncomingMessage, OutgoingMessage } from 'node:http';

export default function handler(_: IncomingMessage, res: OutgoingMessage) {
  res.end('success');
}
