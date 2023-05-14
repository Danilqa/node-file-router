export function withoutTrailingSlashes(path) {
  return path.replace(/\/+$/, '');
}
