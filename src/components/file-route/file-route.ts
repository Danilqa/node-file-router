

export interface FileRoute {
  fileName: string;
  handler: Function | Record<string, Function>;
  regex: RegExp;
  getRouteParams: (pathname: string) => Record<string, string | string[]>;
  weight: number;
}
