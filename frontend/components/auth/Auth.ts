export type AuthRequest = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user_id: number;
  username: string;
  email: string;
  token: string;
};
