import { WebSocket } from 'ws';
import { IGame, IRoom, IWinner } from '../interface/interface.js';

export const playRooms: Array<IRoom> = [];

export const websocketList = new Set<WebSocket>();

export const gamesList: Array<IGame> = [];

export const winnersList: Array<IWinner> = [];
