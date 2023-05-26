import { DynamicRoute } from '../../types/dynamic-route';
import { createRouteParamsParser } from './common/route-params-parser';

const pattern = /\[(\.\.\.\w+)]$/g;

export const catchAllRoute: DynamicRoute = {
  type: 'catch-all',
  parseRoute: createRouteParamsParser({
    pattern,
    paramsGetter: (value: string) => value.split('/'),
    sanitizeParam: param => param.slice('[...'.length, -']'.length),
    routeParamPattern: '(?<:key>.*)'
  }),
  isMatch: route => new RegExp(pattern).test(route),
}
