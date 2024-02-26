import WebSocket from 'ws';
import { stringifyResponse } from '../utils/utils.js';
import { IGame, IAttack, IInstruction, ShipPosition } from '../interface/interface.js';
import { gamesList } from '../data/roomData.js';
import { userList } from '../data/userData.js';

export function handleAttack(command: IInstruction<IAttack>): void {
  const { gameId, indexPlayer } = command.data;
  const currentGame = gamesList[gameId];
  const attackedBoardIndex = indexPlayer ? 0 : 1;

  let coordinates: ShipPosition;

  if (command.type === 'randomAttack') {
    coordinates = generateRandomCoordinates();
  } else {
    const { x, y } = command.data;
    coordinates = {
      x: x ?? 0,
      y: y ?? 0,
    };
  }

  const whoseTurnIndex = currentGame.whoseTurnIndex;
  if (whoseTurnIndex === indexPlayer) {
    const status = detectMissOrKill(currentGame, attackedBoardIndex, coordinates, indexPlayer);
    const turn = generateTurn(currentGame, indexPlayer, status);
    const killedShip = currentGame.roomUsers[attackedBoardIndex].killedShips?.pop();

    currentGame.roomUsers.forEach((player) => {
      const playerWs = userList[player.index - 1].ws;

      if (playerWs) {
        sendTurnResponse(playerWs, turn);
        if (status === 'killed' && killedShip) {
          sendKillShipResponse(playerWs, killedShip, indexPlayer);
          const isGameFinished = currentGame.roomUsers[indexPlayer].isWinner;
          if (isGameFinished) {
            sendFinishResponse(playerWs, indexPlayer);
          }
        }
        sendAttackResponse(playerWs, coordinates, indexPlayer, status);
      }
    });
  }
}
function createFinishResponse(userIndex: number): string {
  const finishResponse = {
    type: 'finish',
    data: {
      winPlayer: userIndex,
    },
    id: 0,
  };
  return stringifyResponse(finishResponse);
}
export function generateTurn(currentGame: IGame, index: number, status: string): number {
  let whoseTurnIndex = 0;
  const hasTurnSpecified = 'whoseTurnIndex' in currentGame;

  switch (status) {
    case 'start':
      if (hasTurnSpecified) {
        whoseTurnIndex = currentGame.whoseTurnIndex !== undefined ? currentGame.whoseTurnIndex : 0;
      } else {
        Math.round(Math.random());
      }
      break;
    case 'miss':
      if (index) {
        whoseTurnIndex = 0;
      } else {
        whoseTurnIndex = 1;
      }
      break;
    case 'kill':
    case 'shot':
      if (index) {
        whoseTurnIndex = 1;
      } else {
        whoseTurnIndex = 0;
      }

      currentGame.whoseTurnIndex = whoseTurnIndex;
  }
  return whoseTurnIndex;
}

export function sendAttackResponse(
  ws: WebSocket,
  coordinates: ShipPosition,
  indexPlayer: number,
  status: string,
): void {
  ws.send(createAttackResponse(coordinates, indexPlayer, status));
}

export function sendTurnResponse(ws: WebSocket, turn: number): void {
  ws.send(createTurnResponse(turn));
}

function createAttackResponse(coordinates: ShipPosition, indexPlayer: number, status: string): string {
  const attackResponse = {
    type: 'attack',
    data: {
      position: coordinates,
      currentPlayer: indexPlayer,
      status,
    },
    id: 0,
  };

  return stringifyResponse(attackResponse);
}

function createTurnResponse(turn: number): string {
  const turnResponse = {
    type: 'turn',
    data: {
      currentPlayer: turn,
    },
    id: 0,
  };

  return stringifyResponse(turnResponse);
}

function detectMissOrKill(
  currentGame: IGame,
  attackedBoardIndex: number,
  coordinates: ShipPosition,
  indexPlayer: number,
) {
  let status = 'miss';
  const shipCoords = currentGame.roomUsers[attackedBoardIndex].shipsCoords;
  const woundedCoords = currentGame.roomUsers[attackedBoardIndex].woundedCoords;
  console.log(shipCoords);
  let foundCoords;
  let shipIndex;

  if (shipCoords) {
    for (let i = 0; i < shipCoords?.length; i++) {
      foundCoords = shipCoords[i].find((coords) => coords.x === coordinates.x && coords.y === coordinates.y);

      if (foundCoords) {
        shipIndex = i;
        break;
      }
    }
    if (foundCoords && shipIndex !== undefined && woundedCoords) {
      status = 'shot';
      const foundCoordsIndex = shipCoords[shipIndex].indexOf(foundCoords);
      const wounded = shipCoords[shipIndex].splice(foundCoordsIndex, 1);
      console.log('wounded', wounded);
      woundedCoords[shipIndex].push(wounded[0]);
      console.log(woundedCoords);

      if (shipCoords[shipIndex].length === 0) {
        status = 'killed';
        const killedShip = woundedCoords[shipIndex];
        currentGame.roomUsers[attackedBoardIndex].killedShips?.push(killedShip);
        const opponentShipsLeft = currentGame.roomUsers[attackedBoardIndex].shipsCoords;
        if (opponentShipsLeft) {
          const isWinner = doesAttackerWin(opponentShipsLeft);
          currentGame.roomUsers[indexPlayer].isWinner = isWinner;
        }
      }
    } else {
      status = 'miss';
    }
  }

  return status;
}
function doesAttackerWin(opponentShips: Array<ShipPosition[]>): boolean {
  const allShipsKilled = opponentShips.every((ship) => ship.length === 0);

  return allShipsKilled;
}

function sendKillShipResponse(playerWs: WebSocket, killedShip: Array<ShipPosition>, indexPlayer: number): void {
  killedShip.forEach((coordinates) => {
    sendAttackResponse(playerWs, coordinates, indexPlayer, 'killed');
  });
}

function sendFinishResponse(ws: WebSocket, userIndex: number): void {
  ws.send(createFinishResponse(userIndex));
}
function generateRandomCoordinates(): ShipPosition {
  const coordinates = {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };

  return coordinates;
}
