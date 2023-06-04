import { IncomingMessage } from 'node:http';
import { URL } from 'node:url';
import { withoutTrailingSlashes } from '../utils/string.utils';
import * as defaultNotFoundHandler from '../components/default-not-found';
import { Adapter } from '../types/adapter';

export const httpAdapter: Adapter = {
  getPathname(req: IncomingMessage) {
    const { pathname } = new URL(withoutTrailingSlashes(req.url || ''), `https://${req.headers.host}`);
    return pathname;
  },
  getMethod(req: IncomingMessage): string | undefined {
    return req.method?.toLowerCase();
  },
  defaultNotFoundHandler: defaultNotFoundHandler.default,
}
