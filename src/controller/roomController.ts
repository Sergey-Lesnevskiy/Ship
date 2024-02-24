import WebSocket from 'ws';
import { playRooms } from '../data/roomData.js';
import { stringifyResponse } from '../utils/utils.js';
import { userList } from '../data/userData.js';
import { websocketList } from '../data/roomData.js';

export function createNewRoom(ws: WebSocket): void {
  const user = userList.find((user) => user.ws === ws);
  if (user) {
    const firstPlayer = {
      name: user?.name,
      index: userList.indexOf(user) + 1,
    };
    const newRoom = {
      roomId: playRooms.length + 1,
      roomUsers: [firstPlayer],
    };
    playRooms.push(newRoom);
    console.log(playRooms[playRooms.length - 1]);

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
