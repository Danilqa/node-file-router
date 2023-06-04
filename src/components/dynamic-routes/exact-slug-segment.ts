import { DynamicRouteSegment } from '../../types/dynamic-route-segment';
import { createRouteSegmentParamsParser } from './common/route-params-parser';

const pattern = /\[(\w+)]/g;

export const exactSlugSegment: DynamicRouteSegment = {
  type: 'catch-all',
  parse: createRouteSegmentParamsParser({
    pattern,
    paramExtractor: value => value,
    sanitizeParam: param => param.slice(1, -1),
    routeParamPattern: '(?<:key>[^/]+)'
  }),
  isMatch: route => new RegExp(pattern).test(route),
}
