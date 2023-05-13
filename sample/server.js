import http from 'node:http';
import { initFileRouter } from '../src/file-router.js';

const useFileRouter = await initFileRouter({ baseDir: './sample/api' });

const server = http.createServer((req, res) => {
  useFileRouter(req, res);
});

const port = 4000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
