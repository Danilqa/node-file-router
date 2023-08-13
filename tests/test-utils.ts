import { initFileRouter } from '../src/file-router';
import { expect } from 'vitest';

export function createTestRequestHandler(url) {
  const filePath = url.replace(process.cwd(), '').replace('/tests', '');

  return (req, res, routeParams) => res.end({ req, filePath, routeParams });
}

export function createTestRequestRunner(requestHandler) {
  return (url, onSuccess) => {
    requestHandler({ url, headers: { host: 'site' } }, { end: onSuccess });
  };
}

export function createTestMethodsRequestRunner(requestHandler) {
  return (url, method, onSuccess) => {
    requestHandler(
      { url, headers: { host: 'site' }, method },
      { end: onSuccess }
    );
  };
}

export function expectAfterInit(baseDir) {
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
