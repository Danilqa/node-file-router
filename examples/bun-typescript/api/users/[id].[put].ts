import { NextFunction } from 'node-file-router';

interface User {
  id: string,
  name: string
}

interface Db {
  [id: string]: User;
}

interface RouteParams {
  id: string;
}

const db: Db = {
  '13': { id: '13', name: 'Dan' }
}

function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj;
}

async function useMiddleware(req: Request, next: NextFunction, routeParams: Record<string, string>) {
  // ... some code
  await next();
}

async function CreateOrUpdateUser(req: Request, routeParams: RouteParams) {
  const maybeUser = await req.json();
  if (!isUser(maybeUser)) {
    return new Response('Invalid user', { status: 400 });
  }

  db[routeParams.id] = maybeUser;

  return new Response(
    JSON.stringify(db[routeParams.id]),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export default [
  useMiddleware,
  CreateOrUpdateUser,
];
