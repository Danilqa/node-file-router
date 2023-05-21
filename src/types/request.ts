import { IncomingMessage } from 'node:http';
import { Dictionary } from "./dictionary";

export interface Request<Q = Dictionary<string | string[]>> extends IncomingMessage {
  query?: Q;
}
