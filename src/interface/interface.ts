export interface IRegUser {
  name: string;
  password: string;
  error?: boolean;
  errorText?: string;
}

export interface IInstruction {
  type: string;
  data: IRegUser;
  id: number;
}
