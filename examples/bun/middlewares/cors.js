export async function useAuth(req, next) {
  const auth = req.headers.get('Authorization');
  if (!auth) {
    return new Response('Unauthorized', { status: 401 });
  }

  await next();
}