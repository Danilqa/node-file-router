import { encodeSlugParam } from '../../slug-param/slug-param';
import { Dictionary } from '../../../types/dictionary';

export type ParamsGetter = (value: string) => string | string[];

interface Params {
  pattern: RegExp;
  paramsGetter: ParamsGetter;
  sanitizeParam: (value: string) => string;
  routeParamPattern: string;
}

export interface ParsedRoute {
  route: string;
  params: Dictionary<ParamsGetter>;
}

export function createRouteParamsParser({ pattern, paramsGetter, routeParamPattern, sanitizeParam }: Params) {
  return function routeParamsParser(route: string): ParsedRoute {
    const slugParamMatch = route.match(pattern)!;
    return slugParamMatch.reduce((acc, currentParam) => {
      const paramName = sanitizeParam(currentParam);
      const key = encodeSlugParam(paramName);

      const newRoute = acc.route.replace(currentParam, routeParamPattern.replace(':key', key))
      const newParams = { ...acc.params, [key]: paramsGetter };

      return { route: newRoute, params: newParams };
    }, { route, params: {} });
  }
}
