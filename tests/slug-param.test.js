import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { decodeSlugParam, encodeSlugParam } from '../src/lib/slug-param/slug-param.js';

const slugParam = suite('SlugParam');

slugParam('should encode a slug param', async (context) => {
  assert.match(encodeSlugParam('slugId'), new RegExp('^slugId_\\d{8}$'));
});

slugParam('should decode a slug param', async (context) => {
  assert.match(decodeSlugParam('slugId_12345678'), 'slugId');
});

slugParam.run();
