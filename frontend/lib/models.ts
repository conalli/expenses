import { AuthResponse } from "../components/auth/Auth";

export type User = {
  id: number;
  username: string;
  email: string;
  token: string;
  groups: Group[];
};

export type GroupMember = {
  id: number;
  username: string;
  email: string;
};

export type Group = {
  id: number;
  name: string;
  members: GroupMember[];
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
