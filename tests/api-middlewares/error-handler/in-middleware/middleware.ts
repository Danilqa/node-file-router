import { createTestMiddlewareRequestHandler } from '../../../test-utils';

export default [
  createTestMiddlewareRequestHandler('a', { hasErrorHandler: true }),
  createTestMiddlewareRequestHandler('b'),
  createTestMiddlewareRequestHandler('c', { hasError: true }),
  createTestMiddlewareRequestHandler('d')
];
