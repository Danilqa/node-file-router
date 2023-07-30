import { randomUUID } from 'node:crypto';
import { parseJson } from '../../utils/server.utils';
import type { UUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Dictionary } from '../../../../src/types/dictionary';

interface RouteParams {
  slug: [UUID];
}

const db: Record<UUID, Dictionary<string>> = {};

export default {
  get(_: IncomingMessage, res: ServerResponse, routeParams: RouteParams) {
    if (!routeParams.slug) {
      return res.end(JSON.stringify(Object.values(db)));
    }

    const [id] = routeParams.slug;
    if (!db[id]) {
      res.statusCode = 404;
      res.end('User Not found');
    }

    res.end(JSON.stringify(db[id]));
  },
  async post(req: IncomingMessage, res: ServerResponse) {
    const userToCreate = await parseJson(req);
    const id = randomUUID();
    db[id] = { ...userToCreate, id };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(db[id]));
  }
};
