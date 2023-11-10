/* c8 ignore start */
export function isCommonJs(): boolean {
  let isCommonJS;
  try {
    // eslint-disable-next-line no-unused-expressions
    require;
    isCommonJS = true;
  } catch (e) {
    isCommonJS = false;
  }

  return isCommonJS;
}
/* c8 ignore stop */
