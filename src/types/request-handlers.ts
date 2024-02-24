/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestHandler = <T = unknown>(
  ...args: any[]
) => Promise<T> | T | void;

export type NextFunction<R = unknown> = () => Promise<void | R | undefined>;

export type FileRouterRequestHandler = <R>(
  ...args: unknown[]
) => Promise<void | R | undefined>;
