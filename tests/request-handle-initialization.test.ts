import { createTestRequestRunner } from './test-utils';
import { initFileRouter } from '../src';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Route } from '../src';

const currentCwd = process.cwd();
vi.mock('process', () => ({
  cwd: () => `${currentCwd}/tests`
}));

describe('RequestHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('#Initialization', () => {
    it('should init file router with the default params', async () => {
      const requestHandler = await initFileRouter();

      const run = createTestRequestRunner(requestHandler);
      const { filePath } = await run('/');

      expect(filePath).toBe('/api/index.ts');
    });

    it('should init file router with an absolute path', async () => {
      const baseDir = `${process.cwd()}/tests/api`;
      const requestHandler = await initFileRouter({ baseDir });
      const run = createTestRequestRunner(requestHandler);

      const { filePath } = await run('/');

      expect(filePath).toBe('/api/index.ts');
    });

    it('should take the method in file names from the initialize callback.', async () => {
      const baseDir = `${process.cwd()}/tests/api-methods-in-files`;
      let actualRoutes: Route[];
      await initFileRouter({
        baseDir,
        onInit: ({ routes }) => {
          actualRoutes = routes;
        }
      });

      expect(actualRoutes).toMatchObject([
        {
          method: 'get',
          urlPath: '/dynamic/catch-all/[...params]',
          handler: expect.any(Function)
        },
        {
          method: 'get',
          urlPath: '/dynamic/exact/[slug]',
          handler: expect.any(Function)
        },
        {
          method: 'get',
          urlPath: '/dynamic/optional-catch-all/[[...params]]',
          handler: expect.any(Function)
        },
        {
          method: 'get',
          urlPath: '/plain/some-route',
          handler: expect.any(Function)
        },
        {
          method: 'post',
          urlPath: '/plain/some-route',
          handler: expect.any(Function)
        },
        {
          method: 'get',
          urlPath: '/root',
          handler: expect.any(Function)
        },
        {
          method: 'post',
          urlPath: '/root',
          handler: expect.any(Function)
        }
      ]);
    });

    it('should take the method in file names from the initialize callback.', async () => {
      const baseDir = `${process.cwd()}/tests/api-basics`;
      let actualRoutes: Route[];
      await initFileRouter({
        ignoreFilesRegex: [/^_.*$/, /.\.some-spec/],
        baseDir,
        onInit: ({ routes }) => {
          actualRoutes = routes;
        }
      });

      expect(actualRoutes).toMatchObject([
        {
          fileName: '[id].ts',
          handler: {
            get: expect.any(Function),
            post: expect.any(Function)
          },
          urlPath: '/one/[id]/two/multi-methods/[id]'
        },
        {
          fileName: '[id].ts',
          handler: expect.any(Function),
          urlPath: '/one/[id]/two/three/[id]'
        },
        {
          fileName: 'index.ts',
          handler: expect.any(Function),
          urlPath: '/one/[id]/two'
        },
        {
          fileName: '[subId].ts',
          handler: expect.any(Function),
          urlPath: '/one/[id]/two/[subId]'
        },
        {
          fileName: 'index.ts',
          handler: expect.any(Function),
          urlPath: '/one/[id]'
        },
        {
          fileName: 'index.ts',
          handler: expect.any(Function),
          urlPath: '/'
        },
        {
          fileName: 'example.ts',
          handler: expect.any(Function),
          urlPath: '/example'
        }
      ]);
    });
  });
});
