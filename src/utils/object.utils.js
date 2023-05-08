export function replaceObjectKeys(obj = {}, replacer) {
  const updatedEntries = Object.entries(obj).map(([key, value]) => [replacer(key), value]);
  return Object.fromEntries(updatedEntries);
}
