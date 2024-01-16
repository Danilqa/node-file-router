export async function useErrorHandler(req, next) {
  try {
    await next();
  } catch (error) {
    return new Response(`Sorry! Error: ${error.message}`, { status: 500 });
  }
}