export interface DynamicRoute {
  isMatch(route: string): boolean;
  get(route: string): string;
}
