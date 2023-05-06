import http from 'node:http';
import { requestHandler } from './request-handler/request-handler.js';

const server = http.createServer(requestHandler);

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
