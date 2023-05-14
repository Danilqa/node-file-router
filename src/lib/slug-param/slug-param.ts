const NUMBER_OF_INDEX_DIGITS = 8;

export function encodeSlugParam(slugParam) {
  const power = NUMBER_OF_INDEX_DIGITS - 1;
  const randomIndex = Math.floor(10 ** power + Math.random() * 9 * 10 ** power);
  return `${slugParam}_${randomIndex}`;
}

export function decodeSlugParam(value) {
  const indexRegexp = new RegExp(`_\\d{${NUMBER_OF_INDEX_DIGITS}}$`);
  return value.replace(indexRegexp, '');
}
