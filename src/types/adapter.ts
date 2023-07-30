import type { RequestHandler } from './request-handler';

export interface Adapter {
  getPathname(...args: unknown[]): string;
  getMethod?(...args: unknown[]): string | undefined;
  defaultNotFoundHandler: RequestHandler;
}
