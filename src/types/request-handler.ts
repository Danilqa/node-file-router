// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestHandler = (...args: any[]) => Promise<void> | void;
