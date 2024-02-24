import { createTestMiddlewareRequestHandler } from '../../../test-utils';

export default [
  createTestMiddlewareRequestHandler('a', { returnResult: 'new-data' }),
  createTestMiddlewareRequestHandler('b', { returnResult: 'some-data' }),
  createTestMiddlewareRequestHandler('c')
];
