import { AuthResponse } from "../Auth";

export type User = {
  id: number;
  email: string;
  token: string;
  groups?: Group[];
};

export type Group = {
  id: number;
  name: string;
  members: User[];
};

export type Currency = {
  id: number;
  name: string;
  decimals: number;
  symbol: string;
};

export type Category = {
  id: number;
  title: string;
  public: boolean;
  group: number;
  created_by: User | null;
};

export type Expense = {
  id: number;
  title: string;
  description: string;
  receipt_url: string;
  amount: number;
  paid: boolean;
  date: string;
  group: Group;
  currency: Currency;
  category: Category;
};

export const userFromAuthResponse = (data: AuthResponse): User => {
  return {
    id: data.user_id,
    email: data.email,
    token: data.token,
  } as User;
};
