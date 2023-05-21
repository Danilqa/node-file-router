import { Request } from 'node-file-router/types/types/request';
import { ServerResponse } from 'node:http';

export default function productsHandler(req: Request, res: ServerResponse) {
  const { id } = req.query!;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ id, name: `User ${id}` }));
}
