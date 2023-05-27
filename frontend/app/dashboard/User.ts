import { AuthResponse } from "../Auth";

export type User = {
  token: string;
  user_id: number;
  email: string;
  groups?: Group[];
};

export type Group = {
  id: number;
  name: string;
  members: number[];
};

export const userFromAuthResponse = (data: AuthResponse): User => {
  return {
    token: data.token,
    user_id: data.user_id,
    email: data.email,
  } as User;
};
