import { NextFunction } from 'node-file-router';

export async function useLogger(req: Request, next: NextFunction) {
  console.log(new Date().toISOString(), `[${req.method}]`, req.url);

  await next();
}