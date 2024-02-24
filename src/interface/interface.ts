import { WebSocket } from 'ws';

// export interface IRegUser {
//   id?: string;
//   name: string;
//   password: string;
//   error?: boolean;
//   errorText?: string;
// }

// export interface IInstruction {
//   type: string;
//   data: IRegUser;
//   id: number;
// }
export interface IInstruction<T> {
  type: string;
  data: T;
  id: number;
}

export interface IRegUser {
  id?: string;
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
