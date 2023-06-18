import { Request, Response } from 'express';

interface RouteParams {
  id: string;
}

export default function productsHandler(_: Request, res: Response, routeParams: RouteParams) {
  const { id } = routeParams;
  res.send(JSON.stringify({ id, name: `User ${id}` }));
}
