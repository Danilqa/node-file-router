import {
  createTestMiddlewareRequestHandler,
  createTestRequestHandler
} from '../../test-utils';

export default [
  createTestMiddlewareRequestHandler('a'),
  createTestMiddlewareRequestHandler('b-interruption', true),
  createTestMiddlewareRequestHandler('c'),
  createTestRequestHandler(__filename, 'route-with-middlewares')
];
