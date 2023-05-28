import { ParsedDynamicSegment } from '../components/dynamic-routes/common/route-params-parser';

export interface DynamicRouteSegment {
  type: string;

  isMatch(route: string): boolean;
  isFileMatch: (fileName: string) => boolean;

  parse(route: string): ParsedDynamicSegment;
}
