export async function useLogger(req, next) {
  console.log(new Date().toISOString(), `[${req.method}]`, req.url);

  await next();
}