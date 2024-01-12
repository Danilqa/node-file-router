import { createTestMiddlewareRequestHandler } from '../../test-utils';

export default [
  createTestMiddlewareRequestHandler('m-list-a'),
  createTestMiddlewareRequestHandler('m-list-b'),
  createTestMiddlewareRequestHandler('m-list-c')
];
