import {
  createTestMiddlewareRequestRunner,
  createTestRequestRunner
} from './test-utils';
import { initFileRouter } from '../src';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { FileRouterRequestHandler } from '../src';

const currentCwd = process.cwd();
vi.mock('process', () => ({
  cwd: () => `${currentCwd}/tests`
}));

describe('RequestHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('#Middlewares', () => {
    let middlewaresRequestHandler: FileRouterRequestHandler;

    beforeAll(async () => {
      middlewaresRequestHandler = await initFileRouter({
        baseDir: 'api-middlewares'
      });
    });

    it('should run the root middleware', async () => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      const { marks } = await run('/');

      expect(marks).toEqual(['before:m-root', 'root-index', 'after:m-root']);
    });

    it('should run the root middleware for dynamic route', async () => {
      const runForMiddleware = createTestMiddlewareRequestRunner(
        middlewaresRequestHandler
      );
      const runForRoute = createTestRequestRunner(middlewaresRequestHandler);

      const { marks } = await runForMiddleware('/nested/123');
      expect(marks).toEqual([
        'before:m-root',
        'before:[id]-nested',
        '[id]',
        'after:[id]-nested',
        'after:m-root'
      ]);
      const { routeParams } = await runForRoute('/nested/123');
      expect(routeParams).toEqual({ id: '123' });
    });

    it('should run the list middleware', async () => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      const { marks } = await run('/middlewares-list');

      expect(marks).toEqual([
        'before:m-root',
        'before:m-list-a',
        'before:m-list-b',
        'before:m-list-c',
        'list',
        'after:m-list-c',
        'after:m-list-b',
        'after:m-list-a',
        'after:m-root'
      ]);
    });

    it('should run the list of middlewares and route with middlewares list', async () => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      const { marks } = await run('/middlewares-list/route-with-middlewares');

      expect(marks).toEqual([
        'before:m-root',
        'before:m-list-a',
        'before:m-list-b',
        'before:m-list-c',
        'before:a',
        'before:b',
        'before:c',
        'route-with-middlewares',
        'after:c',
        'after:b',
        'after:a',
        'after:m-list-c',
        'after:m-list-b',
        'after:m-list-a',
        'after:m-root'
      ]);
    });

    it('should handle single item in the array as route handler with route params', async () => {
      const run = createTestRequestRunner(middlewaresRequestHandler);
      const { routeParams } = await run('/middlewares-list/123/single-route');
      expect(routeParams?.id).toEqual('123');
    });

    it('should handle nested single item in the array as route handler with route params', async () => {
      const run = createTestRequestRunner(middlewaresRequestHandler);

      const { routeParams } = await run('/middlewares-list/123/nested/456');

      expect(routeParams?.id).toEqual('123');
      expect(routeParams?.nestedId).toEqual('456');
    });

    it('should get route params in middlewares', async () => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);
      const { routeParams } = await run('/nested/7/unreachable');
      expect(routeParams?.id).toEqual('7');
    });

    it('should interrupt middleware chain', async () => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      const { marks, result } = await run('/interruption/unreachable-route');

      expect(result).toEqual('before:interrupted');
      expect(marks).toEqual([
        'before:m-root',
        'before:md-interruption',
        'after:m-root'
      ]);
    });

    it('should interrupt the call chain of a file route before next', async () => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      const { marks, result } = await run('/interruption-in-list');

      expect(result).toEqual('before:interrupted');
      expect(marks).toEqual([
        'before:m-root',
        'before:a',
        'before:b-interruption',
        'after:a',
        'after:m-root'
      ]);
    });

    it('should interrupt the call chain in the root middleware', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-middlewares/interruption'
      });
      const run = createTestMiddlewareRequestRunner(requestHandler);

      const { marks, result } = await run('/unreachable-route');

      expect(result).toEqual('before:interrupted');
      expect(marks).toEqual(['before:md-interruption']);
    });

    it('should interrupt the call chain in the root file handler', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-middlewares/interruption-in-list'
      });
      const run = createTestMiddlewareRequestRunner(requestHandler);

      const { marks, result } = await run('/');

      expect(result).toEqual('before:interrupted');
      expect(marks).toEqual(['before:a', 'before:b-interruption', 'after:a']);
    });

    it('should catch and handle error of the file route', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-middlewares/error-handler/in-file-route'
      });

      const run = createTestMiddlewareRequestRunner(requestHandler);
      const { marks } = await run('/');

      expect(marks).toEqual(['before:root', 'list', 'handled-error:root']);
    });

    it('should catch and handle error of middlewares file', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-middlewares/error-handler/in-middleware'
      });

      const run = createTestMiddlewareRequestRunner(requestHandler);
      const { marks } = await run('/unreachable-route');

      expect(marks).toEqual([
        'before:a',
        'before:b',
        'before:c',
        'handled-error:a'
      ]);
    });

    it('should be able to pass data through pipelines', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-middlewares/next-fn-result'
      });

      const run = createTestMiddlewareRequestRunner(requestHandler);
      const { result } = await run('/in-middle');

      expect(result).toEqual('some-data');
    });

    it('should use the last returned data in the pipeline', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-middlewares/next-fn-result'
      });

      const run = createTestMiddlewareRequestRunner(requestHandler);
      const { result } = await run('/override');

      expect(result).toEqual('new-data');
    });

    describe('static vs dynamic routes', () => {
      let staticVsDynamicHandler: FileRouterRequestHandler;

      beforeAll(async () => {
        staticVsDynamicHandler = await initFileRouter({
          baseDir: 'api-middlewares/static-vs-dynamic'
        });
      });

      it('runs every middleware before serving GET /:id/apples', async () => {
        const run = createTestMiddlewareRequestRunner(staticVsDynamicHandler);
        const { marks, routeParams } = await run('/123/apples', 'GET');

        expect(marks).toEqual([
          'before:m-root-static-vs-dynamic',
          'before:m-dynamic-id',
          'before:m-dynamic-apples',
          'route-apples-index-get',
          'after:m-dynamic-apples',
          'after:m-dynamic-id',
          'after:m-root-static-vs-dynamic'
        ]);
        expect(routeParams).toEqual({ id: '123' });
      });

      it('runs every middleware before serving POST /:id/apples/invite', async () => {
        const run = createTestMiddlewareRequestRunner(staticVsDynamicHandler);
        const { marks, routeParams } = await run('/123/apples/invite', 'POST');

        expect(marks).toEqual([
          'before:m-root-static-vs-dynamic',
          'before:m-dynamic-id',
          'before:m-dynamic-apples',
          'route-apples-invite-post',
          'after:m-dynamic-apples',
          'after:m-dynamic-id',
          'after:m-root-static-vs-dynamic'
        ]);
        expect(routeParams).toEqual({ id: '123' });
      });

      it('runs every middleware before serving GET /static/test', async () => {
        const run = createTestMiddlewareRequestRunner(staticVsDynamicHandler);
        const { marks, routeParams } = await run('/static/test', 'GET');

        expect(marks).toEqual([
          'before:m-root-static-vs-dynamic',
          'route-static-test-get',
          'after:m-root-static-vs-dynamic'
        ]);
        expect(routeParams).toEqual({});
      });
    });
  });
});
