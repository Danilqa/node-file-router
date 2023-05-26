import { DynamicRoute } from '../../types/dynamic-route';
import { createRouteParamsParser } from './common/route-params-parser';

const pattern = /\[(\w+)]/g;

export const exactSlugRoute: DynamicRoute = {
  type: 'catch-all',
  parseRoute: createRouteParamsParser({
    pattern,
    paramsGetter: value => value,
    sanitizeParam: param => param.slice(1, -1),
    routeParamPattern: '(?<:key>[^/]+)'
  }),
  isMatch: route => new RegExp(pattern).test(route),
}
