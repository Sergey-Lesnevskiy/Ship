import { WebSocket } from 'ws';
import { IGame, IRoom } from '../interface/interface.js';

export const playRooms: Array<IRoom> = [];

export const websocketList = new Set<WebSocket>();

export const gamesList: Array<IGame> = [];
