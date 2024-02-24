import WebSocket from 'ws';
import { stringifyResponse } from '../utils/utils.js';
import { IGame } from '../interface/interface.js';

export function sendTurnResponse(ws: WebSocket, currentGame: IGame, index: number, status: string): void {
  ws.send(createTurnResponse(currentGame, index, status));
}

function createTurnResponse(currentGame: IGame, index: number, status: string): string {
  const currentPlayerIndex = generateTurn(currentGame, index, status);
  const turnResponse = {
    type: 'turn',
    data: {
      currentPlayer: currentPlayerIndex,
    },
    id: 0,
  };

  return stringifyResponse(turnResponse);
}

function generateTurn(currentGame: IGame, index: number, status: string): number {
  let whoseTurnIndex;
  switch (status) {
    case 'start':
      whoseTurnIndex = currentGame.whoseTurnIndex ? currentGame.whoseTurnIndex : Math.round(Math.random());
      break;
    case 'miss':
      if (index) {
        whoseTurnIndex = 0;
      } else {
        whoseTurnIndex = 1;
      }
      break;
    case 'kill':
      if (index) {
        whoseTurnIndex = 1;
      } else {
        whoseTurnIndex = 0;
      }
      break;
    default:
      return (whoseTurnIndex = index);
  }

  return whoseTurnIndex;
}
