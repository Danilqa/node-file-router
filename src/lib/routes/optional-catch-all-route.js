import { encodeSlugParam } from '../slug-param/slug-param.js';

const pattern = /\/\[\[(\.\.\.\w+)]]$/g;

export const optionalCatchAllRoute = {
  get: initialRoute => {
    const pathMatch = initialRoute.match(pattern);

    console.log(
      pathMatch.reduce((accumulator, currentParam) => {
        const paramName = currentParam.slice('/[[...'.length, -']]'.length);
        return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>.*)`);
      }, initialRoute)
    );

    console.log('pathMatch:', pathMatch, initialRoute);

    return pathMatch.reduce((accumulator, currentParam) => {
      const paramName = currentParam.slice('/[[...'.length, -']]'.length);
      return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>.*)`);
    }, initialRoute);
  },
  isMatch: route => route.match(pattern),
}
