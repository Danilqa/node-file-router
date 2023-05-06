import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { withFilesRouter } from '../src/request-handler.js';

const requestHandlerTest = await withFilesRouter({ baseDir: 'tests/api-basics' });

const testCases = [
  { fromUrl: '/', toFile: '/api-basics/index.js' },
  { fromUrl: '/example', toFile: '/api-basics/example.js' },
  { fromUrl: '/subpath/123', toFile: '/api-basics/subpath/[id]/index.js' },
  { fromUrl: '/subpath/45/subsubpath', toFile: '/api-basics/subpath/[id]/subsubpath/index.js' },
  { fromUrl: '/subpath/55/subsubpath/89', toFile: '/api-basics/subpath/[id]/subsubpath/[subId].js' },
];

testCases.forEach(({ fromUrl, toFile }) => {
  test('index route', () => {
    runRequestHandler(fromUrl, res => assert.is(res, toFile, `return response "${toFile}"`));
  });
});

function runRequestHandler(url, onSuccess) {
  requestHandlerTest(
    { url, headers: { host: 'site' } },
    { end: onSuccess },
  );
}

test.run();
