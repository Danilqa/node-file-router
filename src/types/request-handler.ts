/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestHandler = <T = unknown>(
  ...args: any[]
) => Promise<T> | T | void;
