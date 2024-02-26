import { WebSocket } from 'ws';

export interface IInstruction<T> {
  type: string;
  data: T;
  id: number;
}

export interface IRegUser {
  ws?: WebSocket;
  name: string;
  password: string;
  error?: boolean;
  errorText?: string;
}

export interface IRoom {
  roomId: number;
  roomUsers: Array<IRoomUser>;
}

export interface IRoomUser {
  ws?: WebSocket;
  name: string;
  index: number;
  shipsList?: Array<IShip>;
  indexPlayer?: number;
  shipsCoords?: Array<ShipPosition[]>;
  killedShips?: Array<ShipPosition[]>;
  woundedCoords?: Array<ShipPosition[]>;
  isWinner?: boolean;
}

export interface UserAddToRoom {
  indexRoom: number;
}
export interface IGame {
  roomUsers: Array<IRoomUser>;
  whoseTurnIndex?: number;
  gameId: number;
}
export interface IAddShips {
  gameId: number;
  ships: Array<IShip>;
  indexPlayer: number;
}

export interface IShip {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface ShipPosition {
  x: number;
  y: number;
}
export interface IShipLength {
  [key: string]: number;
}
export interface IAttack {
  gameId: number;
  x?: number;
  y?: number;
  indexPlayer: number;
}
export interface IWinner {
  name: string;
  wins: number;
}
