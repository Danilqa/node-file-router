import { encodeSlugParam } from '../slug-param/slug-param.js';

const pattern = /\[(\.\.\.\w+)]$/g;

export const catchAllRoute = {
  get: initialRoute => {
    const pathMatch = initialRoute.match(pattern);
    return pathMatch.reduce((accumulator, currentParam) => {
      const paramName = currentParam.slice('[...'.length, -']'.length);
      return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>.*)`);
    }, initialRoute);
  },
  isMatch: route => route.match(pattern),
}
