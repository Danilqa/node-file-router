import { encodeSlugParam } from '../../slug-param/slug-param';
import type { Dictionary } from '../../../types/dictionary';

export type ParamExtractor = (value: string) => string | string[];

interface Params {
  pattern: RegExp;
  paramExtractor: ParamExtractor;
  sanitizeParam: (value: string) => string;
  routeParamPattern: string;
}

export interface ParsedDynamicSegment {
  route: string;
  paramExtractors: Dictionary<ParamExtractor>;
}

export function createRouteSegmentParamsParser({
  pattern,
  paramExtractor,
  routeParamPattern,
  sanitizeParam
}: Params) {
  return function parseDynamicSegment(route: string): ParsedDynamicSegment {
    const slugParamMatch = route.match(pattern)!;
    return slugParamMatch.reduce(
      (acc, currentParam) => {
        const paramName = sanitizeParam(currentParam);
        const key = encodeSlugParam(paramName);

        const newRoute = acc.route.replace(
          currentParam,
          routeParamPattern.replace(':key', key)
        );
        const newParams = { ...acc.paramExtractors, [key]: paramExtractor };

        return { route: newRoute, paramExtractors: newParams };
      },
      { route, paramExtractors: {} }
    );
  };
}
