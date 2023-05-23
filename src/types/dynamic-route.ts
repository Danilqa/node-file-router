export interface DynamicRoute {
  isMatch(route: string): boolean;
  get(route: string): string;
  getRouteParams(regexp: RegExp): (pathname: string) => Record<string, string | string[]>;
}
