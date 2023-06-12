import { CollectionMember } from "./models";

export type AuthResponse = {
  user_id: number;
  username: string;
  email: string;
  token: string;
};

export type AddCollectionResponse = {
  id: number;
  name: string;
  members: CollectionMember[];
  created_at: string;
  updated_at: string;
};
