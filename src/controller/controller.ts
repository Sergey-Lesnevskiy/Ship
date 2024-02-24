import WebSocket from 'ws';
import { IInstruction, IRegUser } from '../interface/interface.js';
import { stringifyResponse } from '../utils/utils.js';
import { isNewUser, isPasswordValid } from '../utils/validator.js';
import { userList } from '../data/userData.js';
import { websocketList } from '../data/roomData.js';

export function sendRegResponse(ws: WebSocket, command: IInstruction<IRegUser>): void {
  const response = createRegResponse(command);
  addUser(ws, command.data);
  ws.send(response);
}

export function addUser(ws: WebSocket, userData: IRegUser): void {
  if (isNewUser(userData.name)) {
    userList.push({ ...userData, ws });
    websocketList.add(ws);
    console.log(`user ${userData.name} added to DB`);
  } else {
    updateExistingUser(ws, userData);
  }
}

function updateExistingUser(ws: WebSocket, userData: IRegUser) {
  const user = userList.find((user) => user.name === userData.name);
  if (user) {
    const userPreviousWs = user.ws;
    if (userPreviousWs) {
      websocketList.delete(userPreviousWs);
      websocketList.add(ws);
    }
    user.ws = ws;
  }
}
export function createRegResponse(command: IInstruction<IRegUser>): string {
  const regResponse = {
    type: command.type,
    data: {
      ...command.data,
      error: isNewUser(command.data.name) ? false : isPasswordValid(command.data) ? false : true,
      errorText: isNewUser(command.data.name) ? '' : isPasswordValid(command.data) ? '' : 'Invalid password',
    },
    id: command.id,
  };

  return stringifyResponse(regResponse);
}
