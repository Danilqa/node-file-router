export function withoutTrailingSlashes(path: string): string {
  return path.replace(/\/+$/, '');
}
