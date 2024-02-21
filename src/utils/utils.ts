import { IInstruction } from '../interface/interface.js';

export const parsedCommand = (command: IInstruction) => {
  const parsedCommand = {
    type: JSON.parse(command.toString()).type,
    data: JSON.parse(JSON.parse(command.toString()).data),
    id: JSON.parse(command.toString()).id,
  };

  return parsedCommand;
};
