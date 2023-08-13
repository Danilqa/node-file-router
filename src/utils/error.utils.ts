function useRedBoldText(content: string): string {
  return `\x1b[1m\x1b[31m${content}\x1b[0m`;
}

export class FileRouterError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'FileRouterError';
    this.message = useRedBoldText(message);
    /* c8 ignore next */
    this.stack = this.stack ? useRedBoldText(this.stack) : undefined;
  }
}
