import { WebSocket } from 'ws';

interface IncomeMessage {
  path: string;
  action: string;
}

export interface SocketAdapter {
  getPathname: (incomeMessage: IncomeMessage) => string;
  getMethod: (incomeMessage: IncomeMessage) => string;
  defaultNotFoundHandler: (incomeMessage: IncomeMessage, ws: WebSocket) => void;
}
