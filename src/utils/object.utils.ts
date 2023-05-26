export function mapKeys<NK extends string, V>(
    replacer: (key: string) => NK
): (obj: Record<string, V>) => Record<NK, V> {
  return obj => {
    const updatedEntries = Object.entries(obj).map(([key, value]) => [replacer(key), value]);
    return Object.fromEntries(updatedEntries);
  };
}

export function mapValues<V, NV>(
    replacer: (value: V, key: string) => NV
): (obj: Record<string, V>) => Record<string, NV> {
  return obj => {
    const updatedEntries = Object.entries(obj).map(([key, value]) => [key, replacer(value, key)]);
    return Object.fromEntries(updatedEntries);
  };
}

export function filterValues<V>(
    predicate: (value: V) => boolean
): (obj: Record<string, V>) => Record<string, V> {
  return obj => {
    const updatedEntries = Object.entries(obj).filter(([, value]) => predicate(value));
    return Object.fromEntries(updatedEntries);
  };
}

export function isRecordWith<T>(maybeObject: unknown): maybeObject is Record<string, T> {
  return maybeObject != null && maybeObject.constructor.name === 'Object';
}

export function isFunction(maybeFunction: unknown): maybeFunction is Function {
  return typeof maybeFunction === 'function';
}
