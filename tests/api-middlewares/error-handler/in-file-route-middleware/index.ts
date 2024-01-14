import {
  createTestMiddlewareRequestHandler,
  createTestRequestHandler
} from '../../../test-utils';

export default [
  createTestMiddlewareRequestHandler('a'),
  createTestRequestHandler(__filename, 'route-with-middlewares', {
    hasError: true
  })
];
