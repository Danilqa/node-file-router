import { initFileRouter } from 'node-file-router';

const useFileRouter = await initFileRouter();

const server = Bun.serve({
  port: 3123,
  fetch: (req) => useFileRouter(req),
});

console.log(`Listening on http://localhost:${server.port}`);
