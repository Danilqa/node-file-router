import { createTestRequestHandler } from '../../../../../test-utils.js';

export default {
  get: createTestRequestHandler(import.meta.url),
  post: createTestRequestHandler(import.meta.url),
}
