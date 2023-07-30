export function notifyAll(clients, socket, message) {
  clients.forEach((client) => {
    if (client !== socket) {
      client.send(JSON.stringify(message));
    }
  });
}
