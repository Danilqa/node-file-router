import { initFileRouter } from '../src/file-router';
import { expect } from 'vitest';
import type { IncomingMessage } from 'node:http';
import type { OutgoingMessage } from 'http';
import type { RequestHandler } from '../src/types/request-handler';
import type { Dictionary } from '../src/types/dictionary';

interface SuccessCallbackProps {
  req: IncomingMessage;
  filePath: string;
  routeParams: Dictionary<string>;
}

type SuccessCallback = (data: SuccessCallbackProps) => void;

export function createTestRequestHandler(url: string) {
  const filePath = url.replace(process.cwd(), '').replace('/tests', '');

  return (
    req: IncomingMessage,
    res: OutgoingMessage,
    routeParams: Dictionary<string>
  ) => res.end({ req, filePath, routeParams });
}

export function createTestRequestRunner(requestHandler: RequestHandler) {
  return (url: string, onSuccess: SuccessCallback) => {
    requestHandler({ url, headers: { host: 'site' } }, { end: onSuccess });
  };
}

export function createTestMethodsRequestRunner(requestHandler: RequestHandler) {
  return (url: string, method: string, onSuccess: SuccessCallback) => {
    requestHandler(
      { url, headers: { host: 'site' }, method },
      { end: onSuccess }
    );
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
