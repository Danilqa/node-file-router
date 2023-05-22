import { IncomingMessage } from 'node:http';
import { Dictionary } from "./dictionary";

export interface Request<P = Dictionary<string | string[]>> extends IncomingMessage {
  routeParams?: P;
}
