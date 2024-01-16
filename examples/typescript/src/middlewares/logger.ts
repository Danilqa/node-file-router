import { IncomingMessage, ServerResponse } from 'node:http';
import { NextFunction } from 'node-file-router';

export async function useLogger(req: IncomingMessage, res: ServerResponse, next: NextFunction) {
  console.log(new Date().toISOString(), `[${req.method}]`, req.url);

  await next();
}