import WebSocket from 'ws';
import { IAddShips, IInstruction, IGame, IShip, IShipLength, ShipPosition } from '../interface/interface.js';
import { gamesList } from '../data/roomData.js';
import { stringifyResponse } from '../utils/utils.js';
import { userList } from '../data/userData.js';
import { generateTurn, sendTurnResponse } from './gameCotroller.js';

export function addShipsToGameBoard(ws: WebSocket, command: IInstruction<IAddShips>) {
  const { gameId, ships, indexPlayer } = command.data;

  const userShipsCoordinatesList = ships.map((ship) => convertShipToCoordinates(ship));
  const shipsAmount = userShipsCoordinatesList.length;
  const currentGame = gamesList.find((game) => game.gameId === gameId);
  if (currentGame) {
    const currentPlayer = currentGame.roomUsers.find((user) => user.ws === ws);

    if (currentPlayer) {
      currentPlayer.indexPlayer = indexPlayer;
      currentPlayer.shipsList = ships;
      currentPlayer.shipsCoords = userShipsCoordinatesList;
      currentPlayer.woundedCoords = Array.from({ length: shipsAmount }, () => []);
      currentPlayer.killedShips = [];
    }
    if (bothPlayersReady(currentGame)) {
      const turn = generateTurn(currentGame, 0, 'start');
      currentGame.roomUsers.forEach((player, index) => {
        const playerWs = userList[player.index - 1].ws;
        if (playerWs) {
          sendCreateGameResponse(playerWs, currentGame, index);
          sendTurnResponse(playerWs, turn);
        }
      });
      console.log(`INFO: Both players have ships.\n`);
    } else {
      console.log(`INFO: One player has ships. Waiting for another player\n`);
    }
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
function convertShipToCoordinates(ship: IShip): Array<ShipPosition> {
  const shipCoordinates = [];

  const shipLength: IShipLength = {
    huge: 4,
    large: 3,
    medium: 2,
    small: 1,
  };

  for (let i = 0; i < shipLength[ship.type]; i++) {
    if (ship.direction) {
      const coordinates = {
        x: ship.position.x,
        y: ship.position.y + i,
      };
      shipCoordinates.push(coordinates);
    } else {
      const coordinates = {
        x: ship.position.x + i,
        y: ship.position.y,
      };
      shipCoordinates.push(coordinates);
    }
  }

  return shipCoordinates;
}
