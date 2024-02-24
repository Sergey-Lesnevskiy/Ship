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
  roomUsers: Array<TRoomUser>;
}

type TRoomUser = {
  ws?: WebSocket;
  name: string;
  index: number;
  shipsList?: Array<IShip>;
  indexPlayer?: number;
};

export interface UserAddToRoom {
  indexRoom: number;
}
export interface IGame {
  gameId?: number;
  roomUsers: Array<TRoomUser>;
}
export interface IAddShips {
  gameId: number;
  ships: Array<IShip>;
  indexPlayer: number;
}

interface IShip {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

interface ShipPosition {
  x: number;
  y: number;
}
