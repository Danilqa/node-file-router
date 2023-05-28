import { DynamicRouteSegment } from '../../types/dynamic-route-segment';
import { createRouteSegmentParamsParser } from './common/route-params-parser';

const pattern = /\[(\.\.\.\w+)]$/g;

export const catchAllSegment: DynamicRouteSegment = {
  type: 'catch-all',
  parse: createRouteSegmentParamsParser({
    pattern,
    paramExtractor: (value: string) => value.split('/'),
    sanitizeParam: param => param.slice('[...'.length, -']'.length),
    routeParamPattern: '(?<:key>.*)'
  }),
  isMatch: route => new RegExp(pattern).test(route),
}
