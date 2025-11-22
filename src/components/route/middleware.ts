import { parseDynamicRoute } from '../dynamic-routes/parse-dynamic-route';

interface Props {
  path: string;
  handler: (...args: unknown[]) => Promise<void>;
  nestingLevel: number;
}

function createMiddlewareRegExp(path: string, nestingLevel: number) {
  if (!nestingLevel || path === '/') {
    return /.*/;
  }

  const { route } = parseDynamicRoute(path);

  return new RegExp(`^${route}(?:\\/.*)?$`);
}

export class Middleware {
  path: string;
  regexp: RegExp;
  handler: (...args: unknown[]) => Promise<void>;
  nestingLevel: number;

  constructor(props: Props) {
    this.path = props.path;
    this.handler = props.handler;
    this.nestingLevel = props.nestingLevel;
    this.regexp = createMiddlewareRegExp(props.path, props.nestingLevel);
  }
}
