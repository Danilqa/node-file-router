import * as http from 'node:http';
import { initFileRouter } from '../../src/file-router';

async function run() {
  const useFileRouter = await initFileRouter({ baseDir: `api` });

  const server = http.createServer((req, res) => {
    useFileRouter(req, res);
  });

  const port = 4003;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

run();
