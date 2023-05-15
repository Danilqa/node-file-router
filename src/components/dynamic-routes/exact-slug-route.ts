import { encodeSlugParam } from '../slug-param/slug-param';
import { DynamicRoute } from "../../types/dynamic-route";

const pattern = /\[(\w+)]/g;

export const exactSlugRoute: DynamicRoute = {
  get: initialRoute => {
    const slugParamMatch = initialRoute.match(pattern)!;
    return slugParamMatch.reduce((accumulator, currentParam) => {
      const paramName = currentParam.slice(1, -1);
      return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>[^/]+)`);
    }, initialRoute);
  },
  isMatch: route => pattern.test(route),
}
