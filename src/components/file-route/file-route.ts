

export interface FileRoute {
  handler: Function | Record<string, Function>;
  regex: RegExp;
  getRouteParams: (pathname: string) => Record<string, string | string[]>;
}
