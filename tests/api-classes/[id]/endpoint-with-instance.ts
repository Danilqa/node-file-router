import { createTestRequestHandler } from '../../test-utils';

const resource = class Resource {
  get = createTestRequestHandler(__filename);
  post = createTestRequestHandler(__filename);
};

export default resource;
