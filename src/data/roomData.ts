import { WebSocket } from 'ws';
import { IRoom } from '../interface/interface.js';

export const playRooms: Array<IRoom> = [];

export const websocketList = new Set<WebSocket>();
