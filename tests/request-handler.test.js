import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { withFilesRouter } from '../src/request-handler.js';
import { createTestRequestRunner } from './test-utils.js';

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
  const runRequestHandler = createTestRequestRunner(context.basicCasesRequestHandler);

  mappingTestCases.forEach(({ fromUrl, toFile }) => {
    runRequestHandler(fromUrl, ({ filePath }) => assert.is(filePath, toFile));
  });
});

RequestHandler('should take default 404 fallback when no mapping is found', async (context) => {
  const runRequestHandler = createTestRequestRunner(context.basicCasesRequestHandler);

  runRequestHandler('/one/123/404', res => assert.is(res, '404 Not Found'));
});

RequestHandler('should take custom 404 fallback from _404.js file when no mapping is found', async (context) => {
  const runRequestHandler = createTestRequestRunner(context.notFoundCasesRequestHandler);

  runRequestHandler('/one/123/404', ({ filePath }) => assert.is(filePath, '/api-for-not-found/_404.js'));
});

RequestHandler('should take params from [slug] handlers', async (context) => {
  const slugDataTestCases = [
    { url: '/one/123', params: { id: '123' }, description: 'takes param from directory' },
    { url: '/one/1/two/tree/3', params: { id: '3' }, description: 'takes the last param with the duplicate name' },
    { url: '/one/1/two/2', params: { id: '1', subId: '2' }, description: 'takes all params from all levels' },
  ];
  const runRequestHandler = createTestRequestRunner(context.basicCasesRequestHandler);

  slugDataTestCases.forEach(({ url, params }) => {
    runRequestHandler(url, ({ req }) => assert.equal(req.query, params));
  });
});

RequestHandler.run();
