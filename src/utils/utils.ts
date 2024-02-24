import { RawData } from 'ws';
import { IInstruction } from '../interface/interface.js';

export const stringifyResponse = <T>(response: IInstruction<T>) => {
  const strData = JSON.stringify(response.data);
  const strResponse = JSON.stringify({
    type: response.type,
    data: strData,
    id: response.id,
  });

  return strResponse;
};

export const parsedCommand = <T>(command: RawData): IInstruction<T> => {
  let parsedCommand = JSON.parse(command.toString());
  const parsedData = parsedCommand.data ? JSON.parse(parsedCommand.data) : '';
  parsedCommand = {
    type: parsedCommand.type,
    data: parsedData,
    id: parsedCommand.id,
  };

  return parsedCommand;
};
