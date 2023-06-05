export function getType(something: unknown): string {
  if (something === null) return 'null';
  if (something === undefined) return 'undefined';
  if (Array.isArray(something)) return 'array';

  return typeof something;
}
