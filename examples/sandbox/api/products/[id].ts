import type { IncomingMessage, ServerResponse } from 'node:http';

interface RouteParams {
  id: string;
}

export default function productsHandler(
  _: IncomingMessage,
  res: ServerResponse,
  routeParams: RouteParams
) {
  const { id } = routeParams;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ id, name: `User ${id}` }));
}
