import type { NextFunction } from 'node-file-router';

export async function useErrorHandler(_: Request, next: NextFunction) {
  try {
    await next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Sorry! Error: ${message}`, { status: 500 });
  }
}