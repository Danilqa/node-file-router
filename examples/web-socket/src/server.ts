import { initFileRouter } from 'node-file-router/src/file-router';
import WebSocket from 'ws';
import type { SocketAdapter } from '../types/socket-adapter';

async function run() {
  const port = 8085;

  const server = new WebSocket.Server({ port });

  const useFileRouter = await initFileRouter({
    baseDir: `${__dirname}/api`,
    adapter: <SocketAdapter>{
      getPathname: (incomeMessage) => incomeMessage.path,
      getMethod: (incomeMessage) => incomeMessage.action,
      defaultNotFoundHandler: (incomeMessage, ws) =>
        ws.send(`${incomeMessage.path} is not found.`)
    }
  });

  server.on('error', (e) => {
    console.error('error:', e);
  });

  server.on('connection', (socket) => {
    socket.on('message', (message) => {
      const event = JSON.parse(message.toString());
      useFileRouter(event, socket, server);
    });
  });
}

run();
