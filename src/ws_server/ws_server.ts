import { IncomingMessage } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { router } from '../router/router.js';
import { parsedCommand } from '../utils/utils.js';
import { userList } from '../data/userData.js';
import { deleteRoomsCreatedByUser, sendUpdateRoomStateToAll } from '../controller/roomController.js';
import { handleTechnicalDefeat } from '../controller/gameController.js';

const WS_PORT = 3000;

export const WSServer: WebSocket.Server<typeof WebSocket, typeof IncomingMessage> = new WebSocketServer({
  port: WS_PORT,
});

export function onConnect(ws: WebSocket, req: IncomingMessage): void {
  ws.on('error', console.error);

  console.log(
    `Client connected. Remote Address is ${req.socket.remoteAddress}. Remote Port is ${req.socket.remotePort}\n`,
  );

  ws.on('message', function message(command) {
    console.log(`COMMAND: ${JSON.stringify(parsedCommand(command))}`);
    router(ws, parsedCommand(command));
  });

  ws.on('close', function close() {
    const user = userList.find((user) => user.ws === ws);
    if (user) {
      deleteRoomsCreatedByUser(user);
      sendUpdateRoomStateToAll();
      handleTechnicalDefeat(user);
      console.log(`User ${user.name} disconnected, WebSocket closed`);
    } else {
      console.log('Unauthorized user exited, WebSocket closed');
    }
  });
}
export function onClose(): void {
  console.log('WebSocket Server closed');
}

export function onListen(): void {
  const wsAddress = WSServer.address();
  if (typeof wsAddress !== 'string') {
    console.log(`WebSocket server works on ${wsAddress.port} port. Address is ${wsAddress.address}\n`);
  } else {
    console.log(`WebSocket server works on ${WS_PORT} port\n`);
  }
}
