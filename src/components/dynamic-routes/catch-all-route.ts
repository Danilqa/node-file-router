import { decodeSlugParam, encodeSlugParam } from '../slug-param/slug-param';
import { DynamicRoute } from "../../types/dynamic-route";
import { pipe } from '../../utils/fp.utils';
import { filterValues, mapKeys, mapValues } from '../../utils/object.utils';

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
  getRouteParams: (regex: RegExp) => (pathname: string) => {
    const rawQueryParams = regex.exec(pathname)?.groups || {};

    return pipe(
        mapKeys(decodeSlugParam),
        mapValues((value: string) => value.split('/')),
        filterValues(Boolean)
    )(rawQueryParams);
  }
}
