export function mapKeys(replacer) {
  return obj => {
    const updatedEntries = Object.entries(obj).map(([key, value]) => [replacer(key), value]);
    return Object.fromEntries(updatedEntries);
  }
}

export function mapValues(replacer) {
  return obj => {
    const updatedEntries = Object.entries(obj).map(([key, value]) => [key, replacer(value)]);
    return Object.fromEntries(updatedEntries);
  }
}

export function filterValues(predicate) {
  return obj => {
    const updatedEntries = Object.entries(obj).filter(([, value]) => predicate(value));
    return Object.fromEntries(updatedEntries);
  }
}

export function isObject(maybeObject) {
  return maybeObject != null && maybeObject.constructor.name === 'Object';
}

export function isFunction(maybeFunction) {
  return typeof maybeFunction === 'function';
}
