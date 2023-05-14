import { createTestRequestHandler } from '../../../../../test-utils.js';

export default {
  get: createTestRequestHandler(__filename),
  post: createTestRequestHandler(__filename),
}
