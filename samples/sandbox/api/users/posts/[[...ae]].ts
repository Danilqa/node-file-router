import { UUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';

interface RouteParams {
  ae: [UUID];
}

export default function (_: IncomingMessage, res: ServerResponse, routeParams: RouteParams) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ae: routeParams.ae }));
}
