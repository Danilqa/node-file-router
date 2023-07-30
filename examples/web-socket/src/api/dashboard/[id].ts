import { notifyAll } from '../../utils/server.utils';

export default {
  move: (message, socket, server, { id }) => {
    notifyAll(server.clients, socket, `dashboard ${id} was moved ${message}`);
  },
  resize: (message, socket, server, { id }) => {
    notifyAll(server.clients, socket, `dashboard ${id} was resized ${message}`);
  },
  hide: (message, socket, server, { id }) => {
    notifyAll(server.clients, socket, `dashboard ${id} was hidden ${message}`);
  }
};
