import { createRouteSegmentParamsParser } from './common/route-params-parser';
import type { DynamicRouteSegment } from '../../types/dynamic-route-segment';

const pattern = /\[(\w+)]/g;

export const exactSlugSegment: DynamicRouteSegment = {
  type: 'exact-slug',
  parse: createRouteSegmentParamsParser({
    pattern,
    paramExtractor: (value) => value,
    sanitizeParam: (param) => param.slice(1, -1),
    routeParamPattern: '(?<:key>[^/]+)'
  }),
  isMatch: (route) => new RegExp(pattern).test(route)
};
