import { notifyAll } from '../../utils/server.utils';

export default {
  update: (message, socket, server, { id }) => {
    notifyAll(server.clients, socket, { id, text: message.text });
  }
};
