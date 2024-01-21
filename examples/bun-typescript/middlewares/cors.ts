import type { NextFunction } from 'node-file-router';

export async function useAuth(req: Request, next: NextFunction) {
  const auth = req.headers.get('Authorization');
  if (!auth) {
    return new Response('Unauthorized', { status: 401 });
  }

  await next();
}