import { IInstruction } from '../interface/interface.js';
export const router = (data: IInstruction) => {
  console.log('Data in router', data);

  switch (data.type) {
    case 'reg':
      console.log('send reg response');
      break;
    case 'create_room':
      console.log('create room');
      break;
    case 'add_user_to_room':
      console.log('add user to room');
      break;
    case 'create_game':
      console.log('create game for players');
      break;
    case 'start_game':
      console.log('start game');
      break;
    case 'attack':
      console.log('attack');
      break;
    case 'randomAttack':
      console.log('random attack');
      break;
    case 'update_room':
      console.log('update room state for one player');
      break;
    case 'add_ships':
      console.log('add ships');
      break;
    case 'update_winners':
      console.log('update winners');
      break;
    case 'turn':
      console.log("Info about player's turn");
      break;
    case 'finish':
      console.log('finish game');
      break;
    default:
      console.log('Invalid input');
  }
};
