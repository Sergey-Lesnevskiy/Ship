import WebSocket from 'ws';
import { gamesList, playRooms } from '../data/roomData.js';
import { stringifyResponse } from '../utils/utils.js';
import { userList } from '../data/userData.js';
import { websocketList } from '../data/roomData.js';
import { IInstruction, IGame, UserAddToRoom, IRegUser } from '../interface/interface.js';

export function addUserToRoom(ws: WebSocket, command: IInstruction<UserAddToRoom>) {
  const { indexRoom } = command.data;
  const isCreator = isRoomCreator(ws, indexRoom);

  if (!isCreator) {
    const user = userList.find((user) => user.ws === ws);
    if (user) {
      const secondPlayer = {
        ws: user.ws,
        name: user?.name,
        index: userList.indexOf(user) + 1,
      };

      playRooms[indexRoom - 1].roomUsers.push(secondPlayer);

      playRooms[indexRoom - 1].roomUsers.forEach((player, index) => {
        const playerWS = userList[player.index - 1].ws;
        if (playerWS) {
          sendCreateGameResponse(playerWS, index);
        }
      });

      const deletedRoom = playRooms.splice(indexRoom - 1, 1);

      const game: IGame = {
        roomUsers: deletedRoom[0].roomUsers,
      };
      gamesList.push(game);
      deleteRoomsCreatedByUser(user);
      sendUpdateRoomStateToAll();
    }
  }
}
export function deleteRoomsCreatedByUser(user: IRegUser): void {
  const foundRoom = playRooms.find((room) => {
    return room.roomUsers.some((roomUser) => roomUser.name === user.name);
  });
  if (foundRoom) {
    const foundRoomIndex = playRooms.indexOf(foundRoom);
    playRooms.splice(foundRoomIndex, 1);
  }
}
export function createNewRoom(ws: WebSocket): void {
  const user = userList.find((user) => user.ws === ws);
  if (user && isFirstUserRoom(user)) {
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
    console.log(playRooms[playRooms.length - 1]);

    sendUpdateRoomStateToAll();
  }
}

export function sendUpdateRoomStateToAll(): void {
  websocketList.forEach((wsClient) => {
    sendUpdateRoomState(wsClient);
  });
}

// export function isRoomCreator(ws: WebSocket, indexRoom: number): boolean {
//   const currentRoom = playRooms[indexRoom - 1];
//   const roomCreator = currentRoom.roomUsers.find((user) => user.ws === ws);
//   // console.log('roomCreator', roomCreator);

//   return roomCreator ? true : false;
// }

export function createGameRes(index: number): string {
  const gameResponse = {
    type: 'create_game',
    data: {
      idGame: gamesList.length,
      idPlayer: index,
    },
    id: 0,
  };
  return stringifyResponse(gameResponse);
}
export function createRoomResponse(): string {
  const singleRooms = playRooms
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => {
      return {
        roomId: room.roomId,
        roomUsers: [
          {
            name: room.roomUsers[0].name,
            index: room.roomUsers[0].index,
          },
        ],
      };
    });
  const roomResponse = {
    type: 'update_room',
    data: singleRooms,
    id: 0,
  };

  return stringifyResponse(roomResponse);
}

export function sendCreateGameResponse(ws: WebSocket, index: number): void {
  ws.send(createGameRes(index));
}
export function sendUpdateRoomState(ws: WebSocket): void {
  ws.send(createRoomResponse());
}
function isFirstUserRoom(user: IRegUser): boolean {
  const foundRoomWithUser = playRooms.find((room) => {
    return room.roomUsers.some((roomUser) => roomUser.name === user.name);
  });
  return foundRoomWithUser ? false : true;
}

function isRoomCreator(ws: WebSocket, indexRoom: number): boolean {
  const currentRoom = playRooms[indexRoom - 1];
  console.log(currentRoom);
  if (currentRoom) {
    const roomCreator = currentRoom.roomUsers?.find((user) => user.ws === ws);
    return roomCreator ? true : false;
  } else {
    return false;
  }
}
