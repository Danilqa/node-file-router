import { withFilesRouter } from '../src/request-handler.js';
import { createTestMethodsRequestRunner, createTestRequestRunner } from './test-utils.js';
import { describe, expect, it, beforeAll } from 'vitest';

describe('RequestHandler', () => {
  let basicCasesRequestHandler;
  let notFoundCasesRequestHandler;
  let dynamicSegmentsHandler;

  beforeAll(async () => {
    basicCasesRequestHandler = await withFilesRouter({ baseDir: 'tests/api-basics' });
    notFoundCasesRequestHandler = await withFilesRouter({ baseDir: 'tests/api-for-not-found' });
    dynamicSegmentsHandler = await withFilesRouter({ baseDir: 'tests/api-dynamic-segments' });
  });

  it('should invoke handler from mapped file', () => {
    const mappingTestCases = [
      { fromUrl: '', toFile: '/api-basics/index.js' },
      { fromUrl: '/example', toFile: '/api-basics/example.js' },
      { fromUrl: '/one/123', toFile: '/api-basics/one/[id]/index.js' },
      { fromUrl: '/one/45/two', toFile: '/api-basics/one/[id]/two/index.js' },
      { fromUrl: '/one/55/two/89', toFile: '/api-basics/one/[id]/two/[subId].js' },
      {
        fromUrl: '/one/55/two/three/55',
        toFile: '/api-basics/one/[id]/two/three/[id].js',
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
    run('/one/123/404', ({ filePath }) => expect(filePath).toBe('/api-for-not-found/_404.js'));
  });

  it('should take params from [slug] handlers', () => {
    const run = createTestRequestRunner(basicCasesRequestHandler);
    run('/one/123', ({ req }) => expect(req.query).toEqual({ id: '123' }));
    run('/one/1/two/three/3', ({ req }) => expect(req.query).toEqual({ id: '3' }));
    run('/one/1/two/2', ({ req }) => expect(req.query).toEqual({
      id: '1',
      subId: '2'
    }));
  });

  it('should invoke http-method based handlers', () => {
    const run = createTestMethodsRequestRunner(basicCasesRequestHandler);
    run('/one/1/two/multi-methods/3', 'post', ({ req }) => {
      expect(req.query).toEqual({ id: '3' });
      expect(req.method).toBe('post');
    });

    run(
      '/one/1/two/multi-methods/3',
      'get',
      ({ req }) => {
        expect(req.query).toEqual({ id: '3' });
        expect(req.method).toBe('get');
      }
    );
  });

  it('should returns 404 not found if method doesn\'t exists', () => {
    const run = createTestMethodsRequestRunner(basicCasesRequestHandler);
    run('/one/1/two/multi-methods/3', 'put', res => expect(res).toBe('404 Not Found'));
  });

  it('should get all query params from [...slug]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);
    run('/catch-all/1/2/3/4', ({ req }) => expect(req.query).toEqual({ slug: ['1', '2', '3', '4'] }));
    run('/catch-all/1/2/3/4/', ({ req }) => expect(req.query).toEqual({ slug: ['1', '2', '3', '4'] }));
  });

  it('should take index file when it is defined', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);
    run(
      '/catch-all',
      ({ req, filePath }) => {
        expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.js');
        expect(req.query).toEqual({ slug: undefined });
      });
    run(
      '/catch-all/',
      ({ req, filePath }) => {
        expect(filePath).toEqual('/api-dynamic-segments/catch-all/index.js');
        expect(req.query).toEqual({ slug: undefined });
      });
  });

  it('should catch index file in [[...slug]]', () => {
    const run = createTestRequestRunner(dynamicSegmentsHandler);

    run('/optional-catch-all', ({ req }) => expect(req.query).toEqual({ slug: undefined }));
    run('/optional-catch-all/', ({ req }) => expect(req.query).toEqual({ slug: undefined }));
  });
});
