import * as http from 'node:http';
import { initFileRouter } from 'node-file-router';

const useFileRouter = await initFileRouter();

const server = http.createServer((req, res) => {
  useFileRouter(req, res);
});

const port = 4002;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
