import { userList } from '../data/userData.js';

import { IRegUser } from '../interface/interface.js';

export const isNewUser = (name: string) => {
  const isFound = userList.find((item) => item.name === name);
  return isFound ? false : true;
};

export const isPasswordValid = (user: IRegUser) => {
  const isFound = userList.find((item) => item.name === user.name);
  console.log(isFound?.password);

  return isFound?.password === user.password;
};
