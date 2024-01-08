interface Props {
  path: string;
  handler: (...args: unknown[]) => Promise<void>;
  nestingLevel: number;
}

export class MiddlewareHandler {
  regexp: RegExp;
  handler: (...args: unknown[]) => Promise<void>;
  nestingLevel: number;

  constructor(props: Props) {
    this.handler = props.handler;
    this.nestingLevel = props.nestingLevel;
    this.regexp = new RegExp(props.nestingLevel ? `^${props.path}.*?$` : '.*');
  }
}
