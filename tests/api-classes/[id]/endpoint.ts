import { createTestRequestHandler } from '../../test-utils';

export default class Resource {
  get = createTestRequestHandler(__filename);
  post = createTestRequestHandler(__filename);
}