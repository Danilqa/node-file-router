import {
  createTestMethodsRequestRunner,
  createTestMiddlewareRequestRunner,
  createTestRequestRunner,
  expectAfterInit
} from './test-utils';
import { initFileRouter } from '../src/file-router';
import { describe, expect, it, beforeAll, vi, afterEach } from 'vitest';
import type { RequestHandler } from '../src/types/request-handler';

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
      expect.assertions(1);
      const requestHandler = await initFileRouter();

      const run = createTestRequestRunner(requestHandler);

      run('/', ({ filePath }) => {
        expect(filePath).toBe('/api/index.ts');
      });
    });

    it('should init file router with an absolute path', async () => {
      expect.assertions(1);
      const baseDir = `${process.cwd()}/tests/api`;

      const requestHandler = await initFileRouter({ baseDir });
      const run = createTestRequestRunner(requestHandler);

      run('/', ({ filePath }) => {
        expect(filePath).toBe('/api/index.ts');
      });
    });
  });

  describe('#BasicCases', () => {
    let basicCasesRequestHandler: RequestHandler;
    let notFoundCasesRequestHandler: RequestHandler;

    beforeAll(async () => {
      basicCasesRequestHandler = await initFileRouter({
        baseDir: 'api-basics',
        ignoreFilesRegex: [/^_.*$/, /.\.some-spec/]
      });

      notFoundCasesRequestHandler = await initFileRouter({
        baseDir: 'api-for-not-found'
      });
    });

    it('should invoke handler from mapped file', () => {
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
      expect.assertions(mappingTestCases.length * 2);
      const run = createTestRequestRunner(basicCasesRequestHandler);

      mappingTestCases.forEach(({ fromUrl, toFile }) => {
        run(fromUrl, ({ filePath }) => expect(filePath).toBe(toFile));
        run(`${fromUrl}/`, ({ filePath }) => expect(filePath).toBe(toFile));
      });
    });

    it('should parse a relative reference url', () => {
      expect.assertions(1);
      const run = createTestRequestRunner(basicCasesRequestHandler);

      run('//site.com/example', ({ filePath }) =>
        expect(filePath).toBe('/api-basics/example.ts')
      );
    });

    it('should parse http reference url', () => {
      expect.assertions(1);
      const run = createTestRequestRunner(basicCasesRequestHandler);

      run('http://site.com/example', ({ filePath }) =>
        expect(filePath).toBe('/api-basics/example.ts')
      );
    });

    it('should parse https reference url', () => {
      expect.assertions(1);
      const run = createTestRequestRunner(basicCasesRequestHandler);

      run('https://site.com/example', ({ filePath }) =>
        expect(filePath).toBe('/api-basics/example.ts')
      );
    });

    it('should skip ignoring files', () => {
      expect.assertions(2);
      const run = createTestRequestRunner(basicCasesRequestHandler);

      run('/one/123/index.some-spec', (res) =>
        expect(res).toBe('404 Not Found')
      );
      run('/one/123/_private-file', (res) => expect(res).toBe('404 Not Found'));
    });

    it('should take default 404 fallback when no mapping is found', () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      run('/one/123/404', (res) => expect(res).toBe('404 Not Found'));
    });

    it('should take custom 404 fallback from _404.js file when no mapping is found', () => {
      const run = createTestRequestRunner(notFoundCasesRequestHandler);
      run('/one/123/404', ({ filePath }) =>
        expect(filePath).toBe('/api-for-not-found/_404.ts')
      );
    });

    it('should take params from [slug] handlers', () => {
      const run = createTestRequestRunner(basicCasesRequestHandler);
      run('/one/123', ({ routeParams }) =>
        expect(routeParams).toEqual({ id: '123' })
      );
      run('/one/1/two/three/3', ({ routeParams }) =>
        expect(routeParams).toEqual({ id: '3' })
      );
      run('/one/1/two/2', ({ routeParams }) =>
        expect(routeParams).toEqual({
          id: '1',
          subId: '2'
        })
      );
    });

    it('should invoke http-method based handlers', () => {
      const run = createTestMethodsRequestRunner(basicCasesRequestHandler);
      run('/one/1/two/multi-methods/3', 'post', ({ req, routeParams }) => {
        expect(routeParams).toEqual({ id: '3' });
        expect(req.method).toBe('post');
      });

      run('/one/1/two/multi-methods/3', 'get', ({ req, routeParams }) => {
        expect(routeParams).toEqual({ id: '3' });
        expect(req.method).toBe('get');
      });
    });

    it("should returns 404 not found if method doesn't exists", () => {
      const run = createTestMethodsRequestRunner(basicCasesRequestHandler);
      run('/one/1/two/multi-methods/3', 'put', (res) =>
        expect(res).toBe('404 Not Found')
      );
    });
  });

  describe('#MethodWithFiles', () => {
    let requestHandler: RequestHandler;

    beforeAll(async () => {
      requestHandler = await initFileRouter({
        baseDir: 'api-methods-in-files'
      });
    });

    it('should correctly map methods from filename for plain routes', () => {
      const run = createTestMethodsRequestRunner(requestHandler);
      run('/plain/some-route', 'get', ({ req }) =>
        expect(req.method).toBe('get')
      );
      run('/plain/some-route', 'post', ({ req }) =>
        expect(req.method).toBe('post')
      );
      run('/plain/some-route', 'put', (res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should correctly map methods from filename for exact slug', () => {
      const run = createTestMethodsRequestRunner(requestHandler);
      run('/dynamic/exact/one', 'get', ({ req, routeParams }) => {
        expect(req.method).toBe('get');
        expect(routeParams.slug).toBe('one');
      });
      run('/dynamic/exact/one', 'put', (res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should correctly map methods from filename for catch all slugs', () => {
      const run = createTestMethodsRequestRunner(requestHandler);
      run('/dynamic/catch-all/a/b/c', 'get', ({ req, routeParams }) => {
        expect(req.method).toBe('get');
        expect(routeParams.params).toEqual(['a', 'b', 'c']);
      });
      run('/dynamic/catch-all/a/b/c', 'put', (res) =>
        expect(res).toBe('404 Not Found')
      );
    });

    it('should correctly map methods from filename for optional catch all slugs', () => {
      const run = createTestMethodsRequestRunner(requestHandler);
      run(
        '/dynamic/optional-catch-all/a/b/c',
        'get',
        ({ req, routeParams }) => {
          expect(req.method).toBe('get');
          expect(routeParams.params).toEqual(['a', 'b', 'c']);
        }
      );
      run('/dynamic/optional-catch-all', 'get', ({ req, routeParams }) => {
        expect(req.method).toBe('get');
        expect(routeParams.params).toEqual(undefined);
      });
      run('/dynamic/optional-catch-all', 'put', (res) => {
        expect(res).toBe('404 Not Found');
      });
    });

    it('should correctly map methods from filename for index files', () => {
      const run = createTestMethodsRequestRunner(requestHandler);
      run('/root', 'get', ({ req }) => {
        expect(req.method).toBe('get');
      });
      run('/root', 'post', ({ req }) => {
        expect(req.method).toBe('post');
      });
      run('/root', 'put', (res) => {
        expect(res).toBe('404 Not Found');
      });
    });
  });

  describe('#DynamicCases', () => {
    let dynamicSegmentsHandler: RequestHandler;

    beforeAll(async () => {
      dynamicSegmentsHandler = await initFileRouter({
        baseDir: 'api-dynamic-segments'
      });
    });

    it('should get one route param from [...slug]', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);
      run('/catch-all/1', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
      run('/catch-all/1/', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
    });

    it('should get all route params from [...slug]', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);
      run('/catch-all/1/2/3/4', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3', '4'] })
      );
      run('/catch-all/1/2/3/4/', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3', '4'] })
      );
    });

    it('should take index file when it is defined', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);
      run('/catch-all', ({ routeParams, filePath }) => {
        expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.ts');
        expect(routeParams).toEqual({ slug: undefined });
      });
      run('/catch-all/', ({ routeParams, filePath }) => {
        expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.ts');
        expect(routeParams).toEqual({ slug: undefined });
      });
    });

    it('should catch index file in [[...slug]]', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      run('/optional-catch-all', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: undefined })
      );
      run('/optional-catch-all/', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: undefined })
      );
    });

    it('should catch one param in [[...slug]]', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      run('/optional-catch-all/1', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
      run('/optional-catch-all/1/', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1'] })
      );
    });

    it('should catch files near slug [[...slug]] firstly', () => {
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

      mappingTestCases.forEach(({ fromUrl, toFile }) => {
        run(fromUrl, ({ filePath }) => expect(filePath).toBe(toFile));
        run(`${fromUrl}/`, ({ filePath }) => expect(filePath).toBe(toFile));
      });
    });

    it('should catch several params in [[...slug]]', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      run('/optional-catch-all/1/2/3', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3'] })
      );
      run('/optional-catch-all/1/2/3/', ({ routeParams }) =>
        expect(routeParams).toEqual({ slug: ['1', '2', '3'] })
      );
    });

    it('should catch all params during combination of dynamic segments', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      run('/combination/1/sub/1/2', ({ routeParams, filePath }) => {
        expect(filePath).toEqual(
          '/api-dynamic-segments/combination/[id]/sub/[...ids].ts'
        );
        expect(routeParams).toEqual({ id: '1', ids: ['1', '2'] });
      });
      run('/combination/1/sub/sub-sub/4/5/6', ({ routeParams, filePath }) => {
        expect(filePath).toEqual(
          '/api-dynamic-segments/combination/[id]/sub/sub-sub/[[...ids]].ts'
        );
        expect(routeParams).toEqual({ id: '1', ids: ['4', '5', '6'] });
      });
    });

    it('should process correctly for catch all segment before other types', () => {
      const run = createTestRequestRunner(dynamicSegmentsHandler);

      run(
        '/combination/one/two/three/plain/image.jpg',
        ({ routeParams, filePath }) => {
          expect(filePath).toEqual(
            '/api-dynamic-segments/combination/[...operations]/plain/[slug].ts'
          );
          expect(routeParams).toEqual({
            operations: ['one', 'two', 'three'],
            slug: 'image.jpg'
          });
        }
      );
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
        'It should only export either a function or an object'
      );
    });

    it('should throws error when file has invalid exported type', async () => {
      await expectAfterInit(
        'not-valid-api-invalid-type/undefined'
      ).toThrowError('It should only export either a function or an object');
    });

    it('should throws error when file does not export default', async () => {
      await expectAfterInit('not-valid-api-no-default').toThrowError(
        'does not contain a default export'
      );
    });
  });

  describe('#Middlewares', () => {
    let middlewaresRequestHandler: RequestHandler;

    beforeAll(async () => {
      middlewaresRequestHandler = await initFileRouter({
        baseDir: 'api-middlewares'
      });
    });

    it('should run the root middleware', () => {
      expect.assertions(1);
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      run('/', ({ marks }) => {
        expect(marks).toEqual(['before:m-root', 'root-index', 'after:m-root']);
      });
    });

    it('should run the list middleware', ({ expect: _expect }) => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      run('/middlewares-list', ({ marks }) => {
        _expect(marks).toEqual([
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
    });

    it('should run the list middlewares and route with middlewares list', ({
      expect: _expect
    }) => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      run('/middlewares-list/route-with-middlewares', ({ marks }) => {
        _expect(marks).toEqual([
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
    });

    it('should run the root middleware', ({ expect: _expect }) => {
      const run = createTestMiddlewareRequestRunner(middlewaresRequestHandler);

      run('/', ({ marks }) => {
        _expect(marks).toEqual(['before:m-root', 'root-index', 'after:m-root']);
      });
    });
  });
});
