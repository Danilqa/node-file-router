import type { NextFunction } from 'node-file-router';

export async function useCors(req: Request, next: NextFunction<Response>) {
  const res = await next();
  if (!res) return;

  res.headers.set('Access-Control-Allow-Methods', 'PUT');

  return res;
}
