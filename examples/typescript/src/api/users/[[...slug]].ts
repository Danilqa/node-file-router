import { randomUUID } from 'node:crypto';
import { parseJson } from '../../utils/server.utils';
import type { UUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

const db: Record<UUID, Record<string, string>> = {};

export default {
  get(req: IncomingMessage, res: ServerResponse, { slug: [id] }) {
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
  }
};
