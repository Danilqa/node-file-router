import { pipe } from '../../utils/fp.utils';
import { filterValues, mapKeys, mapValues } from '../../utils/object.utils';
import { decodeSlugParam } from '../slug-param/slug-param';
import type { Dictionary } from '../../types/dictionary';
import type { ParamExtractor } from '../dynamic-routes/common/route-params-parser';

import type { RequestHandler } from '../../types/request-handlers';

interface Props {
  method?: string;
  fileName: string;
  handler: RequestHandler | Record<string, RequestHandler>;
  regex: RegExp;
  paramExtractors: Record<string, ParamExtractor>;
  nestingLevel: number;
  urlPath: string;
}

export class Route {
  method?: string;
  fileName: string;
  handler: RequestHandler | Record<string, RequestHandler>;
  regex: RegExp;
  nestingLevel: number;
  urlPath: string;

  private paramExtractors: Record<string, ParamExtractor>;

  constructor(props: Props) {
    Object.assign(this, props);
  }

  getRouteParams(pathname: string): Dictionary<string> {
    const groups = new RegExp(this.regex).exec(pathname)?.groups || {};
    return pipe(
      filterValues<string>(Boolean),
      mapValues<string, string | string[]>((group, key) =>
        this.paramExtractors[key](group)
      ),
      mapKeys(decodeSlugParam)
    )(groups);
  }
}
