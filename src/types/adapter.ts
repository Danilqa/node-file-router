export interface Adapter {
  getPathname(...args: unknown[]): string;
  getMethod?(...args: unknown[]): string | undefined;
  defaultNotFoundHandler: Function;
}
