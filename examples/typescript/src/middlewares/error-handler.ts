import { IncomingMessage, ServerResponse } from 'node:http';
import { NextFunction } from 'node-file-router';

export async function useErrorHandler(_: IncomingMessage, res: ServerResponse, next: NextFunction) {
  try {
    await next();
  } catch (error) {
    return res
      .writeHead(500, { 'Content-Type': 'text/html' })
      .end(`Houston, we have a problem: ${error.message}`);
  }
}