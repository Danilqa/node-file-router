import { IncomingMessage } from 'node:http';

export interface Request extends IncomingMessage {
  query: Record<string, string | string[]>;
}
