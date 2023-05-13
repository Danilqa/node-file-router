import { encodeSlugParam } from '../slug-param/slug-param.js';

const pattern = /\[(\w+)]/g;

export const exactSlugRoute = {
  get: initialRoute => {
    const slugParamMatch = initialRoute.match(pattern);
    return slugParamMatch.reduce((accumulator, currentParam) => {
      const paramName = currentParam.slice(1, -1);
      return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>[^/]+)`);
    }, initialRoute);
  },
  isMatch: route => route.match(pattern),
}
