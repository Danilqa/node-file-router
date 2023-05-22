import { pipe } from "../../utils/fp.utils";
import { filterValues, mapKeys, mapValues } from "../../utils/object.utils";
import { decodeSlugParam } from "../slug-param/slug-param";

interface Props {
  handler: Function;
  routeKey: string;
}

export class FileRoute {
  handler: Function | Record<string, Function>;
  regex: RegExp;

  constructor({ handler, routeKey }: Props) {
    this.handler = handler;
    this.regex = new RegExp(`^${routeKey}/?$`);
  }

  getRouteParams = (pathname: string): Record<string, string | string[]> => {
    const rawQueryParams = this.regex.exec(pathname)?.groups || {};

    return pipe(
        mapKeys(decodeSlugParam),
        mapValues((value: string) => value.includes('/') ? value.split('/') : value),
        filterValues(Boolean)
    )(rawQueryParams);
  }
}
