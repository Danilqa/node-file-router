const http = require('node:http');
const { initFileRouter } = require('node-file-router');

async function run() {
  const useFileRouter = await initFileRouter({ baseDir: './api' });

  const server = http.createServer((req, res) => {
    useFileRouter(req, res);
  });

  const port = 4001;
  server.listen(4001, () => console.log(`Server running at http://localhost:${port}/`));
}

run();
