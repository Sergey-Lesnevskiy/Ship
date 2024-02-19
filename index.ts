import { IncomingMessage } from 'http';
import { httpServer } from './src/http_server/index.js';
import WebSocket, { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WSServer: WebSocket.Server<typeof WebSocket, typeof IncomingMessage> = new WebSocketServer({ port: WS_PORT });

WSServer.on('connection', onConnect);
WSServer.on('close', onClose);

function onConnect(ws: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>): void {
  ws.on('error', console.error);

  console.log(`WS works on ${WS_PORT}`);

  ws.on('message', function message(data) {
    console.log('Data: ', JSON.parse(data));
  });
}

function onClose(): void {
  console.log('WS closed');
}
