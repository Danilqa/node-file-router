import { createTestMiddlewareRequestHandler } from '../../../test-utils';

export default [
  createTestMiddlewareRequestHandler('a'),
  createTestMiddlewareRequestHandler('b', { returnResult: 'some-data' }),
  createTestMiddlewareRequestHandler('c')
];
