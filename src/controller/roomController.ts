import WebSocket from 'ws';
import { gamesList, playRooms } from '../data/roomData.js';
import { stringifyResponse } from '../utils/utils.js';
import { userList } from '../data/userData.js';
import { websocketList } from '../data/roomData.js';
import { IInstruction, IGame, UserAddToRoom } from '../interface/interface.js';

export function addUserToRoom(ws: WebSocket, command: IInstruction<UserAddToRoom>) {
  const { indexRoom } = command.data;
  const user = userList.find((user) => user.ws === ws);
  if (user) {
    const secondPlayer = {
      ws: user.ws,
      name: user?.name,
      index: userList.indexOf(user) + 1,
    };

    playRooms[indexRoom - 1].roomUsers.push(secondPlayer);

    playRooms[indexRoom - 1].roomUsers.forEach((player) => {
      const playerWs = userList[player.index - 1].ws;
      if (playerWs) {
        sendCreateGameResponse(playerWs);
      }
    });

    const deletedRoom = playRooms.splice(indexRoom - 1, 1);

    const game: IGame = {
      roomUsers: deletedRoom[0].roomUsers,
    };

    gamesList.push(game);

    websocketList.forEach((wsClient) => {
      sendUpdateRoomState(wsClient);
    });
  }
}
export function sendCreateGameResponse(ws: WebSocket) {
  ws.send(createGameResponse());
}
function createGameResponse(): string {
  const gameResponse = {
    type: 'create_game',
    data: {},
    id: 0,
  };

  return stringifyResponse(gameResponse);
}

export function createNewRoom(ws: WebSocket): void {
  const user = userList.find((user) => user.ws === ws);
  if (user) {
    const firstPlayer = {
      ws: user.ws,
      name: user?.name,
      index: userList.indexOf(user) + 1,
    };
    const newRoom = {
      roomId: playRooms.length + 1,
      roomUsers: [firstPlayer],
    };
    playRooms.push(newRoom);

    websocketList.forEach((wsClient) => {
      if (wsClient !== ws) {
        sendUpdateRoomState(wsClient);
      }
    });
  }
}

export function sendUpdateRoomState(ws: WebSocket) {
  ws.send(createRoomRes());
}

export function createRoomRes(): string {
  const singleRooms = playRooms.filter((room) => room.roomUsers.length === 1);
  const roomResponse = {
    type: 'update_room',
    data: singleRooms,
    id: 0,
  };

  return stringifyResponse(roomResponse);
}
