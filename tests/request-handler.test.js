import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { withFilesRouter } from '../src/request-handler.js';
import { createTestMethodsRequestRunner, createTestRequestRunner } from './test-utils.js';

const RequestHandler = suite('Request Handler');

RequestHandler.before(async (context) => {
  context.basicCasesRequestHandler = await withFilesRouter({ baseDir: 'tests/api-basics' });
  context.notFoundCasesRequestHandler = await withFilesRouter({ baseDir: 'tests/api-for-not-found' });
});

RequestHandler('should invoke handler from mapped file', async (context) => {
  const mappingTestCases = [
    { fromUrl: '/', toFile: '/api-basics/index.js' },
    { fromUrl: '/example', toFile: '/api-basics/example.js' },
    { fromUrl: '/one/123', toFile: '/api-basics/one/[id]/index.js' },
    { fromUrl: '/one/45/two', toFile: '/api-basics/one/[id]/two/index.js' },
    { fromUrl: '/one/55/two/89', toFile: '/api-basics/one/[id]/two/[subId].js' },
    {
      fromUrl: '/one/55/two/three/55',
      toFile: '/api-basics/one/[id]/two/three/[id].js',
    }
  ];
  const run = createTestRequestRunner(context.basicCasesRequestHandler);

  mappingTestCases.forEach(({ fromUrl, toFile }) => {
    run(fromUrl, ({ filePath }) => assert.is(filePath, toFile));
  });
});

RequestHandler('should take default 404 fallback when no mapping is found', async (context) => {
  const run = createTestRequestRunner(context.basicCasesRequestHandler);

  run('/one/123/404', res => assert.is(res, '404 Not Found'));
});

RequestHandler('should take custom 404 fallback from _404.js file when no mapping is found', async (context) => {
  const run = createTestRequestRunner(context.notFoundCasesRequestHandler);

  run('/one/123/404', ({ filePath }) => assert.is(filePath, '/api-for-not-found/_404.js'));
});

RequestHandler('should take params from [slug] handlers', async (context) => {
  const run = createTestRequestRunner(context.basicCasesRequestHandler);

  run('/one/123', ({ req }) => assert.equal(req.query, { id: '123' }, 'takes param from directory'));
  run('/one/1/two/three/3', ({ req }) => assert.equal(req.query, { id: '3' }, 'takes the last param with the duplicate name'));
  run('/one/1/two/2', ({ req }) => assert.equal(req.query, {
    id: '1',
    subId: '2'
  }, 'takes all params from all levels'));
});

RequestHandler('should invoke http-method based handlers', async (context) => {
  const run = createTestMethodsRequestRunner(context.basicCasesRequestHandler);

  run(
    '/one/1/two/multi-methods/3',
    'post',
    ({ req }) => {
      assert.equal(req.query, { id: '3' });
      assert.equal(req.method, 'post');
    }
  );

  run(
    '/one/1/two/multi-methods/3',
    'get',
    ({ req }) => {
      assert.equal(req.query, { id: '3' });
      assert.equal(req.method, 'get');
    }
  );
});

RequestHandler('should returns 404 not found if method doesn\'t exists', async (context) => {
  const run = createTestMethodsRequestRunner(context.basicCasesRequestHandler);
  run('/one/1/two/multi-methods/3', 'put', res => assert.is(res, '404 Not Found'));
});

RequestHandler.run();
