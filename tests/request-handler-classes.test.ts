import { createTestRequestRunner } from './test-utils';
import { initFileRouter } from '../src';
import { afterEach, describe, expect, it, vi } from 'vitest';

const currentCwd = process.cwd();
vi.mock('process', () => ({
  cwd: () => `${currentCwd}/tests`
}));

describe('RequestHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('#Classes', () => {
    const baseDir = `${process.cwd()}/tests/api-classes`;

    it('should invoke http-method based handlers from class-based file', async () => {
      const requestHandler = await initFileRouter({ baseDir });
      const run = createTestRequestRunner(requestHandler);

      await run('/3/endpoint', 'post').then(({ req, routeParams }) => {
        expect(routeParams).toEqual({ id: '3' });
        expect(req?.method).toBe('post');
      });
      await run('/3/endpoint', 'get').then(({ req, routeParams }) => {
        expect(routeParams).toEqual({ id: '3' });
        expect(req?.method).toBe('get');
      });
    });

    it('should invoke http-method based handlers from instance of class based file', async () => {
      const requestHandler = await initFileRouter({ baseDir });
      const run = createTestRequestRunner(requestHandler);

      await run('/3/endpoint-with-instance', 'post').then(
        ({ req, routeParams }) => {
          expect(routeParams).toEqual({ id: '3' });
          expect(req?.method).toBe('post');
        }
      );
      await run('/3/endpoint-with-instance', 'get').then(
        ({ req, routeParams }) => {
          expect(routeParams).toEqual({ id: '3' });
          expect(req?.method).toBe('get');
        }
      );
    });
  });
});
