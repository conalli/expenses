import { AuthResponse } from "../components/auth/Auth";

export type User = {
  id: number;
  username: string;
  email: string;
  collections: Collection[];
};

export type UserWithToken = User & {
  token: string;
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
  group: number | null;
  created_by: User | null;
};

export type Expense = {
  id: number;
  title: string;
  description: string;
  receipt_url: string;
  category: Category;
  amount: number;
  currency: Currency;
  paid: boolean;
  paid_by: User | null;
  group: Collection;
  date: string;
  created_by: User;
};

export const userFromAuthResponse = (data: AuthResponse): UserWithToken => {
  return {
    id: data.user_id,
    email: data.email,
    token: data.token,
    username: data.username,
    collections: [],
  } as UserWithToken;
};
