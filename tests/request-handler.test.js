import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { withFilesRouter } from '../src/request-handler.js';

const requestHandlerTest = await withFilesRouter({ baseDir: 'tests/api-basics' });

const testCases = [
  { fromUrl: '/', toFile: '/api-basics/index.js' },
  { fromUrl: '/example', toFile: '/api-basics/example.js' },
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
