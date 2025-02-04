import { Hono } from 'hono';
import { initFileRouter } from 'node-file-router';
import type { Context } from 'hono';

const app = new Hono();

export interface HonoAdapter {
  getPathname: (context: Context) => string;
  getMethod: (context: Context) => string;
  defaultNotFoundHandler: (context: Context) => void;
}

const useFileRouter = await initFileRouter({
  baseDir: './src/api',
  adapter: <HonoAdapter>{
    getPathname: (context) => new URL(context.req.url).pathname,
    getMethod: (context) => context.req.method,
    defaultNotFoundHandler: (context) =>
      context.notFound()
  }
});

app.use(async (c) => {
  await useFileRouter(c)
});

export default app;
