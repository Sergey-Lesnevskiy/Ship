import WebSocket from 'ws';
import { IAddShips, IInstruction, IGame } from '../interface/interface.js';
import { gamesList } from '../data/roomData.js';
import { stringifyResponse } from '../utils/utils.js';
import { userList } from '../data/userData.js';

export function addShipsToGameBoard(ws: WebSocket, command: IInstruction<IAddShips>) {
  const { gameId, ships, indexPlayer } = command.data;

  const currentGame = gamesList[gameId];
  const currentPlayer = currentGame.roomUsers.find((user) => user.ws === ws);
  if (currentPlayer) {
    currentPlayer.indexPlayer = indexPlayer;
    currentPlayer.shipsList = ships;
  }
  if (bothPlayersReady(currentGame)) {
    currentGame.roomUsers.forEach((player, index) => {
      const playerWs = userList[player.index - 1].ws;
      if (playerWs) {
        sendCreateGameResponse(playerWs, currentGame, index);
      }
    });
  }
}
function bothPlayersReady(currentGame: IGame): boolean {
  const haveShips = currentGame.roomUsers.every((player) => player.shipsList?.length);

  return haveShips;
}
export function createStartGameResponse(currentGame: IGame, index: number): string {
  const startGameResponse = {
    type: 'start_game',
    data: {
      ships: currentGame.roomUsers[index].shipsList,
      currentPlayerIndex: index,
    },
    id: 0,
  };

  return stringifyResponse(startGameResponse);
}

function sendCreateGameResponse(ws: WebSocket, currentGame: IGame, index: number): void {
  const createGameResponse = createStartGameResponse(currentGame, index);
  ws.send(createGameResponse);
}
