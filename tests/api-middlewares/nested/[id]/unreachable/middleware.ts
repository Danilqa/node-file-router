import { createTestMiddlewareRequestHandler } from '../../../../test-utils';

export default createTestMiddlewareRequestHandler(__filename, {
  hasInterruption: true
});
