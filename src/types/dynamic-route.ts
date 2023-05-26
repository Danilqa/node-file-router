import { ParsedRoute } from '../components/dynamic-routes/common/route-params-parser';

export interface DynamicRoute {
  type: string;

  isMatch(route: string): boolean;

  parseRoute(route: string): ParsedRoute;
}
