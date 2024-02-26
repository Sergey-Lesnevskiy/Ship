import { WebSocket } from 'ws';
import { IAddShips, IAttack, IInstruction, IRegUser, UserAddToRoom } from '../interface/interface.js';
import { sendRegResponse, sendUpdateWinnersToAll } from '../controller/controller.js';
import { addUserToRoom, createNewRoom, sendUpdateRoomStateToAll } from '../controller/roomController.js';
import { addShipsToGameBoard } from '../controller/shipController.js';
import { handleAttack } from '../controller/gameController.js';

export const router = <T>(ws: WebSocket, data: IInstruction<T>) => {
  switch (data.type) {
    case 'reg':
      sendRegResponse(ws, data as IInstruction<IRegUser>);
      sendUpdateRoomStateToAll();
      sendUpdateWinnersToAll();
      console.log('reg room');
      break;
    case 'create_room':
      createNewRoom(ws);
      console.log('create room');
      break;
    case 'add_user_to_room':
      addUserToRoom(ws, data as IInstruction<UserAddToRoom>);
      console.log('add user to room');
      break;
    case 'add_ships':
      addShipsToGameBoard(ws, data as IInstruction<IAddShips>);
      console.log('add ships');
      break;
    case 'attack':
    case 'randomAttack':
      handleAttack(data as IInstruction<IAttack>);
      console.log('random attack');
      break;
    default:
      console.log('Invalid input');
  }
};
