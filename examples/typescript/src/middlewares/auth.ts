import type { NextFunction } from 'node-file-router';
import { IncomingMessage, ServerResponse } from 'node:http';

export async function useAuth(req: IncomingMessage, res: ServerResponse, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res
      .writeHead(401, { 'Content-Type': 'text/html' })
      .end('Not Authorized');
  }

  await next();
}