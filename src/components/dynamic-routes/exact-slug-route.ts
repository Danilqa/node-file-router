import { decodeSlugParam, encodeSlugParam } from '../slug-param/slug-param';
import { DynamicRoute } from '../../types/dynamic-route';
import { pipe } from '../../utils/fp.utils';
import { filterValues, mapKeys } from '../../utils/object.utils';

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
  getRouteParams: (regex: RegExp) => (pathname: string) => {
    const rawQueryParams = regex.exec(pathname)?.groups || {};

    return pipe(
        mapKeys<string, string>(decodeSlugParam),
        filterValues(Boolean)
    )(rawQueryParams);
  }
}
