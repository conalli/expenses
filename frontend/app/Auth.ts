export type AuthRequest = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user_id: number;
  email: string;
};
