import { Request } from 'node-file-router/types/types/request';
import { ServerResponse } from 'node:http';

export default function usersHandler(_: Request, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify([{ id: 1, name: 'Phone' }, { id: 2, name: 'Gamebnoy' }]));
}
