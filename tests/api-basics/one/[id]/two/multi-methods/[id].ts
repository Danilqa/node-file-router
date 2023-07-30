import { createTestRequestHandler } from '../../../../../test-utils';

export default {
  get: createTestRequestHandler(__filename),
  post: createTestRequestHandler(__filename)
};
