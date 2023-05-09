export function replaceObjectKeys(obj = {}, replacer) {
  const updatedEntries = Object.entries(obj).map(([key, value]) => [replacer(key), value]);
  return Object.fromEntries(updatedEntries);
}

export function isObject(maybeObject) {
  return maybeObject != null && maybeObject.constructor.name === 'Object';
}

export function isFunction(maybeFunction) {
  return typeof maybeFunction === 'function';
}
