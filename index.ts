import { httpServer } from './src/http_server/index.js';
import { WSServer, onConnect, onClose } from './src/ws_server/ws_server.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

WSServer.on('connection', onConnect);
WSServer.on('close', onClose);
