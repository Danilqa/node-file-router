export function getType(something: unknown): string {
  if (something === null) return 'null';
  if (something === undefined) return 'undefined';
  if (Array.isArray(something)) return 'array';

  return typeof something;
}

export function isClass(maybeClass: unknown): boolean {
  return (
    typeof maybeClass === 'function' && /^class\s/.test(maybeClass.toString())
  );
}
