import { createTestRequestRunner, expectAfterInit } from './test-utils';
import { initFileRouter } from '../src';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { FileRouterRequestHandler } from '../src';

import type { IncomingMessage } from 'node:http';

const currentCwd = process.cwd();
vi.mock('process', () => ({
  cwd: () => `${currentCwd}/tests`
}));

describe('RequestHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('#Adapter', () => {
    const adapter = {
      getPathname: (req: IncomingMessage) => req.url || '',
      defaultNotFoundHandler: () => {},
      getMethod: undefined
    };

    it('should handle request even getMethod is not defined', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-for-adapter',
        adapter
      });
      const run = createTestRequestRunner(requestHandler);

      const { filePath } = await run('/exact');

      expect(filePath).toBe('/api-for-adapter/exact.ts');
    });

    it('should override the default method', async () => {
      const requestHandler = await initFileRouter({
        baseDir: 'api-for-adapter',
        adapter: { ...adapter, getMethod: () => 'custom' }
      });
      const run = createTestRequestRunner(requestHandler);

      const { filePath } = await run('/endpoint');

      expect(filePath).toBe('/api-for-adapter/endpoint.[custom].ts');
    });
  });

  describe('#BasicCases', () => {
    let basicCasesRequestHandler: FileRouterRequestHandler;
    let notFoundCasesRequestHandler: FileRouterRequestHandler;

    beforeAll(async () => {
      basicCasesRequestHandler = await initFileRouter({
        baseDir: 'api-basics',
        ignoreFilesRegex: [/^_.*$/, /.\.some-spec/]
      });

      notFoundCasesRequestHandler = await initFileRouter({
        baseDir: 'api-for-not-found'
      });
    });

    it('should invoke handler from mapped file', async () => {
      const mappingTestCases = [
        { fromUrl: '', toFile: '/api-basics/index.ts' },
        { fromUrl: '/example', toFile: '/api-basics/example.ts' },
        { fromUrl: '/one/123', toFile: '/api-basics/one/[id]/index.ts' },
        { fromUrl: '/one/45/two', toFile: '/api-basics/one/[id]/two/index.ts' },
        {
          fromUrl: '/one/55/two/89',
          toFile: '/api-basics/one/[id]/two/[subId].ts'
        },
        {
          fromUrl: '/one/55/two/three/30',
          toFile: '/api-basics/one/[id]/two/three/[id].ts'
        }
      ];
      const run = createTestRequestRunner(basicCasesRequestHandler);

      await Promise.all(
        mappingTestCases.map(async ({ fromUrl, toFile }) => {
          await run(fromUrl).then(({ filePath }) =>
            expect(filePath).toBe(toFile)
          );

          await run(`${fromUrl}/`).then(({ filePath }) =>
            expect(filePath).toBe(toFile)
          );
        })
      );
    });

    it('should parse a relative reference url', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      const { filePath } = await run('//site.com/example');
      expect(filePath).toBe('/api-basics/example.ts');
    });

    it('should parse http reference url', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      const { filePath } = await run('http://site.com/example');
      expect(filePath).toBe('/api-basics/example.ts');
    });

    it('should parse https reference url', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      const { filePath } = await run('https://site.com/example');
      expect(filePath).toBe('/api-basics/example.ts');
    });

    it('should skip ignoring files', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);

      await run<string>('/one/123/index.some-spec').then((res) =>
        expect(res).toBe('404 Not Found')
      );
      await run<string>('/one/123/_private-file').then((res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should take default 404 fallback when no mapping is found', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      const res = await run<string>('/one/123/404');
      expect(res).toBe('404 Not Found');
    });

    it('should take custom 404 fallback from _404.js file when no mapping is found', async () => {
      const run = createTestRequestRunner(notFoundCasesRequestHandler);
      const { filePath } = await run('/one/123/404');
      expect(filePath).toBe('/api-for-not-found/_404.ts');
    });

    it('should take params from [slug] handlers', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);

      await run('/one/123').then(({ routeParams }) =>
        expect(routeParams).toEqual({ id: '123' })
      );
      await run('/one/1/two/three/3').then(({ routeParams }) =>
        expect(routeParams).toEqual({ id: '3' })
      );
      await run('/one/1/two/2').then(({ routeParams }) =>
        expect(routeParams).toEqual({ id: '1', subId: '2' })
      );
    });

    it('should invoke http-method based handlers', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);

      await run('/one/1/two/multi-methods/3', 'post').then(
        ({ req, routeParams }) => {
          expect(routeParams).toEqual({ id: '3' });
          expect(req?.method).toBe('post');
        }
      );
      await run('/one/1/two/multi-methods/3', 'get').then(
        ({ req, routeParams }) => {
          expect(routeParams).toEqual({ id: '3' });
          expect(req?.method).toBe('get');
        }
      );
    });

    it('should returns 404 not found if method does not exists', async () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      const res = await run<string>('/one/1/two/multi-methods/3', 'put');
      expect(res).toBe('404 Not Found');
    });
  });

  describe('#MethodWithFiles', () => {
    let requestHandler: FileRouterRequestHandler;

    beforeAll(async () => {
      requestHandler = await initFileRouter({
        baseDir: 'api-methods-in-files'
      });
    });

    it('should correctly map methods from filename for plain routes', async () => {
      const run = createTestRequestRunner(requestHandler);

      await run('/plain/some-route', 'get').then(({ req }) =>
        expect(req?.method).toBe('get')
      );
      await run('/plain/some-route', 'post').then(({ req }) =>
        expect(req?.method).toBe('post')
      );
      await run('/plain/some-route', 'put').then((res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should correctly map methods from filename for exact slug', async () => {
      const run = createTestRequestRunner(requestHandler);

      await run('/dynamic/exact/one', 'get').then(({ req, routeParams }) => {
        expect(req.method).toBe('get');
        expect(routeParams?.slug).toBe('one');
      });
      await run<string>('/dynamic/exact/one', 'put').then((res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should correctly map methods from filename for catch all slugs', async () => {
      const run = createTestRequestRunner(requestHandler);

      await run('/dynamic/catch-all/a/b/c', 'get').then(
        ({ req, routeParams }) => {
          expect(req.method).toBe('get');
          expect(routeParams?.params).toEqual(['a', 'b', 'c']);
        }
      );
      await run('/dynamic/catch-all/a/b/c', 'put').then((res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should correctly map methods from filename for optional catch all slugs', async () => {
      const run = createTestRequestRunner(requestHandler);

      await run('/dynamic/optional-catch-all/a/b/c', 'get').then(
        ({ req, routeParams }) => {
          expect(req.method).toBe('get');
          expect(routeParams?.params).toEqual(['a', 'b', 'c']);
        }
      );
      await run('/dynamic/optional-catch-all', 'get').then(
        ({ req, routeParams }) => {
          expect(req.method).toBe('get');
          expect(routeParams?.params).toEqual(undefined);
        }
      );
      await run('/dynamic/optional-catch-all', 'put').then((res) => {
        expect(res).toBe('404 Not Found');
      });
    });

    it('should correctly map methods from filename for index files', async () => {
      const run = createTestRequestRunner(requestHandler);

      await run('/root', 'get').then(({ req }) => {
        expect(req.method).toBe('get');
      });
      await run('/root', 'post').then(({ req }) => {
        expect(req.method).toBe('post');
      });
      await run('/root', 'put').then((res) => {
        expect(res).toBe('404 Not Found');
      });
    });
  });

  describe('#DynamicCases', () => {
    let dynamicSegmentsHandler: FileRouterRequestHandler;

    beforeAll(async () => {
      dynamicSegmentsHandler = await initFileRouter({
        baseDir: 'api-dynamic-segments'
      });
    });

    it('should get one route param from [...slug]', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/catch-all/1').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
      await run('/catch-all/1/').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
    });

    it('should get all route params from [...slug]', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/catch-all/1/2/3/4').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3', '4'] })
      );
      await run('/catch-all/1/2/3/4/').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3', '4'] })
      );
    });

    it('should take index file when it is defined', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/catch-all').then(({ routeParams, filePath }) => {
        expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.ts');
        expect(routeParams).toEqual({ slug: undefined });
      });
      await run('/catch-all/').then(({ routeParams, filePath }) => {
        expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.ts');
        expect(routeParams).toEqual({ slug: undefined });
      });
    });

    it('should catch index file in [[...slug]]', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/optional-catch-all').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: undefined })
      );
      await run('/optional-catch-all/').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: undefined })
      );
    });

    it('should catch one param in [[...slug]]', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/optional-catch-all/1').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
      await run('/optional-catch-all/1/').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
    });

    it('should catch files near slug [[...slug]] firstly', async () => {
      const mappingTestCases = [
        {
          fromUrl: '/optional-catch-all/with-other-files/test',
          toFile:
            '/api-dynamic-segments/optional-catch-all/with-other-files/test.ts'
        },
        {
          fromUrl: '/optional-catch-all/with-other-files/1/2/3',
          toFile:
            '/api-dynamic-segments/optional-catch-all/with-other-files/[[...slug]].ts'
        }
      ];
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await Promise.all(
        mappingTestCases.map(async ({ fromUrl, toFile }) => {
          await run(fromUrl).then(({ filePath }) =>
            expect(filePath).toBe(toFile)
          );
          await run(`${fromUrl}/`).then(({ filePath }) =>
            expect(filePath).toBe(toFile)
          );
        })
      );
    });

    it('should catch several params in [[...slug]]', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/optional-catch-all/1/2/3').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3'] })
      );
      await run('/optional-catch-all/1/2/3/').then(({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3'] })
      );
    });

    it('should catch all params during combination of dynamic segments', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      await run('/combination/1/sub/1/2').then(({ routeParams, filePath }) => {
        expect(filePath).toEqual(
          '/api-dynamic-segments/combination/[id]/sub/[...ids].ts'
        );
        expect(routeParams).toEqual({ id: '1', ids: ['1', '2'] });
      });
      await run('/combination/1/sub/sub-sub/4/5/6').then(
        ({ routeParams, filePath }) => {
          expect(filePath).toEqual(
            '/api-dynamic-segments/combination/[id]/sub/sub-sub/[[...ids]].ts'
          );
          expect(routeParams).toEqual({ id: '1', ids: ['4', '5', '6'] });
        }
      );
    });

    it('should process correctly for catch all segment before other types', async () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      const { routeParams, filePath } = await run(
        '/combination/one/two/three/plain/image.jpg'
      );

      expect(filePath).toEqual(
        '/api-dynamic-segments/combination/[...operations]/plain/[slug].ts'
      );
      expect(routeParams).toEqual({
        operations: ['one', 'two', 'three'],
        slug: 'image.jpg'
      });
    });
  });

  describe('#Validations', () => {
    it('should throws an error when the folder with files does not exist', async () => {
      await expectAfterInit('not-existing-path').toThrowError(
        /The folder on the .* isn't found/
      );
    });

    it('should throws error when file has invalid exported type', async () => {
      await expectAfterInit('not-valid-api-invalid-type/array').toThrowError(
        'It should only export either a function or an object'
      );
    });

    it('should throws error when file has invalid exported type', async () => {
      await expectAfterInit('not-valid-api-invalid-type/null').toThrowError(
        'It should only export either a function, an array or an object'
      );
    });

    it('should throws error when file has invalid exported type', async () => {
      await expectAfterInit(
        'not-valid-api-invalid-type/undefined'
      ).toThrowError(
        'It should only export either a function, an array or an object'
      );
    });

    it('should throws error when file does not export default', async () => {
      await expectAfterInit('not-valid-api-no-default').toThrowError(
        'does not contain a default export'
      );
    });
  });
});
