import { randomUUID, UUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { parseJson } from '../../utils/server.utils';

interface RouteParams {
  slug: [UUID];
}

const db: Record<UUID, Record<string, string>> = {};

export default {
  get(_: IncomingMessage, res: ServerResponse, { slug: [id] }: RouteParams) {
    if (!db[id]) {
      res.statusCode = 404;
      res.end('Not found');
    }

    res.end(JSON.stringify(db[id]));
  },
  async post(req: IncomingMessage, res: ServerResponse) {
    const userToCreate = await parseJson(req);
    const id = randomUUID();
    db[id] = { ...userToCreate, id };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(db[id]));
  },
}
