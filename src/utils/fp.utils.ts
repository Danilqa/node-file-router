// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pipe<T>(...fns: Array<(arg: T) => any>) {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}
