import { initFileRouter } from 'node-file-router';

const useFileRouter = await initFileRouter();

const server = Bun.serve({
  port: 3123,
  fetch: async (req) => {
    const res = await useFileRouter<Response>(req);
    return res || new Response('No Response is provided', { status: 500 });
  }
});

console.log(`Listening on http://localhost:${server.port}`);
