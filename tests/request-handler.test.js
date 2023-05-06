import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { withFilesRouter } from '../src/request-handler.js';

const requestHandlerTest = await withFilesRouter({ baseDir: 'tests/api-basics' });
test('first level path', t => {
  requestHandlerTest(
    { url: 'http://site.com', headers: { host: 'site' } },
    {
      end: result => assert.is(result, 'root', 'return "index"')
    },
  );
});

test('index route', t => {
  requestHandlerTest(
    { url: 'http://site.com/root-path', headers: { host: 'site' } },
    {
      end: result => assert.is(result, 'root', 'return "root"')
    },
  );
});

test.run();
