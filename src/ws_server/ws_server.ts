import { IncomingMessage } from 'http';
import { httpServer } from '../http_server/index.js';
import WebSocket, { WebSocketServer } from 'ws';
import { router } from '../router/router.js';
import { parsedCommand } from '../utils/utils.js';
import { userList } from '../data/userData.js';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

export const WSServer: WebSocket.Server<typeof WebSocket, typeof IncomingMessage> = new WebSocketServer({
  port: WS_PORT,
});

// WSServer.on('connection', onConnect);
// WSServer.on('close', onClose);

export function onConnect(ws: WebSocket): void {
  ws.on('error', console.error);

  console.log(`WS works on ${WS_PORT}`);

  ws.on('message', function message(command) {
    router(ws, parsedCommand(command));
  });
  ws.on('close', function close() {
    const user = userList.find((user) => user.ws === ws);
    if (user) {
      console.log(`User ${user.name} exited, WebSocket closed`);
    } else {
      console.log('Unauthorized user exited, WebSocket closed');
    }
  });
}
