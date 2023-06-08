import { AuthResponse } from "../components/auth/Auth";

export type User = {
  id: number;
  username: string;
  email: string;
  token: string;
  collections: Collection[];
};

export type CollectionMember = {
  id: number;
  username: string;
  email: string;
};

export type Collection = {
  id: number;
  name: string;
  members: CollectionMember[];
  created_at: string;
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
  group: Collection;
  currency: Currency;
  category: Category;
};

export const userFromAuthResponse = (data: AuthResponse): User => {
  return {
    id: data.user_id,
    email: data.email,
    token: data.token,
    username: data.username,
    collections: [],
  } as User;
};
