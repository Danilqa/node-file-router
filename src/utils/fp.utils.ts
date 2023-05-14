export function pipe(...functions) {
  return input => functions.reduce((acc, func) => func(acc), input);
}
