import * as http from 'node:http';
import { initFileRouter } from 'node-file-router';

async function run() {
  const useFileRouter = await initFileRouter({ baseDir: './api' });

  const server = http.createServer((req, res) => {
    useFileRouter(req, res);
  });

  const port = 4002;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

run();
