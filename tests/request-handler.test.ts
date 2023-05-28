import { initFileRouter } from '../src/file-router';
import { createTestMethodsRequestRunner, createTestRequestRunner } from './test-utils.js';
import { describe, expect, it, beforeAll } from 'vitest';

describe('RequestHandler', () => {
  let basicCasesRequestHandler;
  let notFoundCasesRequestHandler;
  let dynamicSegmentsHandler;

  beforeAll(async () => {
    basicCasesRequestHandler = await initFileRouter({ baseDir: 'tests/api-basics' });
    notFoundCasesRequestHandler = await initFileRouter({ baseDir: 'tests/api-for-not-found' });
    dynamicSegmentsHandler = await initFileRouter({ baseDir: 'tests/api-dynamic-segments' });
  });

  it('should invoke handler from mapped file', () => {
    const mappingTestCases = [
      { fromUrl: '', toFile: '/api-basics/index.ts' },
      { fromUrl: '/example', toFile: '/api-basics/example.ts' },
      { fromUrl: '/one/123', toFile: '/api-basics/one/[id]/index.ts' },
      { fromUrl: '/one/45/two', toFile: '/api-basics/one/[id]/two/index.ts' },
      { fromUrl: '/one/55/two/89', toFile: '/api-basics/one/[id]/two/[subId].ts' },
      {
        fromUrl: '/one/55/two/three/55',
        toFile: '/api-basics/one/[id]/two/three/[id].ts',
      }
    ];
    const run = createTestRequestRunner(basicCasesRequestHandler);

    mappingTestCases.forEach(({ fromUrl, toFile }) => {
      run(fromUrl, ({ filePath }) => expect(filePath).toBe(toFile));
      run(`${fromUrl}/`, ({ filePath }) => expect(filePath).toBe(toFile));
    });
  });

  it('should take default 404 fallback when no mapping is found', () => {
    const run = createTestRequestRunner(basicCasesRequestHandler);
    run('/one/123/404', res => expect(res).toBe('404 Not Found'));
  });

  it('should take custom 404 fallback from _404.js file when no mapping is found', () => {
    const run = createTestRequestRunner(notFoundCasesRequestHandler);
    run('/one/123/404', ({ filePath }) => expect(filePath).toBe('/api-for-not-found/_404.ts'));
  });

  it('should take params from [slug] handlers', () => {
    const run = createTestRequestRunner(basicCasesRequestHandler);
    run('/one/123', ({ routeParams }) => expect(routeParams).toEqual({ id: '123' }));
    run('/one/1/two/three/3', ({ routeParams }) => expect(routeParams).toEqual({ id: '3' }));
    run('/one/1/two/2', ({ routeParams }) => expect(routeParams).toEqual({
      id: '1',
      subId: '2'
    }));
  });

  it('should invoke http-method based handlers', () => {
    const run = createTestMethodsRequestRunner(basicCasesRequestHandler);
    run('/one/1/two/multi-methods/3', 'post', ({ req, routeParams }) => {
      expect(routeParams).toEqual({ id: '3' });
      expect(req.method).toBe('post');
    });

    run(
        '/one/1/two/multi-methods/3',
        'get',
        ({ req, routeParams }) => {
          expect(routeParams).toEqual({ id: '3' });
          expect(req.method).toBe('get');
        }
    );
  });

  it('should returns 404 not found if method doesn\'t exists', () => {
    const run = createTestMethodsRequestRunner(basicCasesRequestHandler);
    run('/one/1/two/multi-methods/3', 'put', res => expect(res).toBe('404 Not Found'));
  });

  it('should get one route param from [...slug]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);
    run('/catch-all/1', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1'] }));
    run('/catch-all/1/', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1'] }));
  });

  it('should get all route params from [...slug]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);
    run('/catch-all/1/2/3/4', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1', '2', '3', '4'] }));
    run('/catch-all/1/2/3/4/', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1', '2', '3', '4'] }));
  });

  it('should take index file when it is defined', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);
    run(
        '/catch-all',
        ({ routeParams, filePath }) => {
          expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.ts');
          expect(routeParams).toEqual({ slug: undefined });
        });
    run(
        '/catch-all/',
        ({ routeParams, filePath }) => {
          expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.ts');
          expect(routeParams).toEqual({ slug: undefined });
        });
  });

  it('should catch index file in [[...slug]]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);

    run('/optional-catch-all', ({ routeParams }) => expect(routeParams).toEqual({ slug: undefined }));
    run('/optional-catch-all/', ({ routeParams }) => expect(routeParams).toEqual({ slug: undefined }));
  });

  it('should catch one param in [[...slug]]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);

    run('/optional-catch-all/1', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1'] }));
    run('/optional-catch-all/1/', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1'] }));
  });

  it('should catch files near slug [[...slug]] firstly', () => {
    const mappingTestCases = [
      { fromUrl: '/optional-catch-all/with-other-files/test', toFile: '/api-dynamic-segments/optional-catch-all/with-other-files/test.ts' },
      { fromUrl: '/optional-catch-all/with-other-files/1/2/3', toFile: '/api-dynamic-segments/optional-catch-all/with-other-files/[[...slug]].ts' },
    ];
    const run = createTestRequestRunner(dynamicSegmentsHandler);

    mappingTestCases.forEach(({ fromUrl, toFile }) => {
      run(fromUrl, ({ filePath }) => expect(filePath).toBe(toFile));
      run(`${fromUrl}/`, ({ filePath }) => expect(filePath).toBe(toFile));
    });
  });

  it('should catch several params in [[...slug]]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);

    run('/optional-catch-all/1/2/3', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1', '2', '3'] }));
    run('/optional-catch-all/1/2/3/', ({ routeParams }) => expect(routeParams).toEqual({ slug: ['1', '2', '3'] }));
  });

  it('should catch all params during combination of dynamic segments', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);

    run('/combination/1/sub/1/2', ({ routeParams, filePath }) => {
      expect(filePath).toEqual('/api-dynamic-segments/combination/[id]/sub/[...ids].ts');
      expect(routeParams).toEqual({ id: '1', ids: ['1', '2'] });
    });
    run('/combination/1/sub/sub-sub/4/5/6', ({ routeParams, filePath }) => {
      expect(filePath).toEqual('/api-dynamic-segments/combination/[id]/sub/sub-sub/[[...ids]].ts');
      expect(routeParams).toEqual({ id: '1', ids: ['4', '5', '6'] });
    });
  });
});
