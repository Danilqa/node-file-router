import { initFileRouter } from '../src/file-router';
import { expect } from 'vitest';

import type { IncomingMessage } from 'node:http';
import type { OutgoingMessage } from 'http';
import type { RequestHandler } from '../src/types/request-handler';
import type { Dictionary } from '../src/types/dictionary';

type SuccessCallback = (props: {
  req: IncomingMessage;
  filePath: string;
  routeParams: Dictionary<string>;
}) => void;

interface MiddlewareResult {
  req?: IncomingMessage;
  marks?: string[];
  result?: string;
}

export interface MiddlewareResponseMock {
  registerCall: (props: MiddlewareResult) => void;
}

export function createTestRequestHandler(url: string, label = 'route-handler') {
  const filePath = url.replace(process.cwd(), '').replace('/tests', '');

  return (
    req: IncomingMessage,
    res: OutgoingMessage,
    marks: string[],
    routeParams: Dictionary<string>
  ) => {
    marks.push(label);
    res.end({ req, marks, filePath, routeParams });
  };
}

export function createTestRequestRunner(requestHandler: RequestHandler) {
  return (url: string, onSuccess: SuccessCallback) => {
    requestHandler(
      { url, headers: { host: 'site' } },
      { end: onSuccess, registerCall: () => {} },
      []
    );
  };
}

export function createTestMethodsRequestRunner(requestHandler: RequestHandler) {
  return (url: string, method: string, onSuccess: SuccessCallback) => {
    requestHandler(
      { url, headers: { host: 'site' }, method },
      { end: onSuccess },
      []
    );
  };
}

export function createTestMiddlewareRequestRunner(
  requestHandler: RequestHandler
) {
  return async (url: string) => {
    let runnerResult: MiddlewareResult = {};
    const result = await requestHandler(
      { url, headers: { host: 'site' } },
      {
        end: () => {},
        registerCall: (props: MiddlewareResult) => {
          runnerResult = props;
        }
      },
      []
    );

    return { ...runnerResult, result };
  };
}

export function expectAfterInit(baseDir: string) {
  return {
    toThrowError: async (messageLike: RegExp | string) => {
      try {
        await initFileRouter({ baseDir });
      } catch (e) {
        expect(e.message).toMatch(messageLike);
      }
    }
  };
}

export function createTestMiddlewareRequestHandler(
  label: string,
  hasInterruption = false
) {
  return async (
    req: IncomingMessage,
    res: MiddlewareResponseMock,
    marks: string[],
    next: () => Promise<void>
  ) => {
    marks.push(`before:${label}`);

    if (hasInterruption) {
      res.registerCall({ req, marks });
      return 'before:interrupted';
    }

    await next();

    marks.push(`after:${label}`);
    res.registerCall({ req, marks });
  };
}
