import {
  createTestMiddlewareRequestHandler,
  createTestRequestHandler
} from '../../../../test-utils';

export default [
  createTestMiddlewareRequestHandler('c'),
  createTestRequestHandler(__filename, 'nested-route-with-middlewares')
];
