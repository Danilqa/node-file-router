import http from 'node:http';
import { withFilesRouter } from './../src/request-handler.js';

const server = http.createServer(await withFilesRouter({ baseDir: './sample/api' }));

const port = 4000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
