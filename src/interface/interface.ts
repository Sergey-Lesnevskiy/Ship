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
  name: string;
  index: number;
};

export interface UserAddToRoom {
  indexRoom: number;
}
export interface IGame {
  gameId?: number;
  roomUsers: Array<TRoomUser>;
}
