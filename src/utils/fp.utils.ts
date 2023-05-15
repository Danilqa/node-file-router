export function pipe<T>(...fns: Array<(arg: T) => any>) {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}
