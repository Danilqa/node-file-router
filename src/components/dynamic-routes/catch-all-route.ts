import { encodeSlugParam } from '../slug-param/slug-param';
import { DynamicRoute } from "../../types/dynamic-route";

const pattern = /\[(\.\.\.\w+)]$/g;

export const catchAllRoute: DynamicRoute = {
  get: initialRoute => {
    const pathMatch = initialRoute.match(pattern)!;
    return pathMatch.reduce((accumulator, currentParam) => {
      const paramName = currentParam.slice('[...'.length, -']'.length);
      return accumulator.replace(currentParam, `(?<${encodeSlugParam(paramName)}>.*)`);
    }, initialRoute);
  },
  isMatch: route => pattern.test(route),
}
