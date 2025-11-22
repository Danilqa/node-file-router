import { exactSlugSegment } from './exact-slug-segment';
import { catchAllSegment } from './catch-all-segment';
import { optionalCatchAllSegment } from './optional-catch-all-segment';
import type { ParamExtractor } from './common/route-params-parser';

export interface ParsedDynamicRoute {
  route: string;
  paramExtractors: Record<string, ParamExtractor>;
}

export function parseDynamicRoute(initialRoute: string): ParsedDynamicRoute {
  return [exactSlugSegment, catchAllSegment, optionalCatchAllSegment]
    .filter((dynamicRoute) => dynamicRoute.isMatch(initialRoute))
    .reduce(
      (acc, route) => {
        const parsedRoute = route.parse(acc.route);
        return {
          route: parsedRoute.route,
          paramExtractors: {
            ...acc.paramExtractors,
            ...parsedRoute.paramExtractors
          }
        };
      },
      { route: initialRoute, paramExtractors: {} }
    );
}
