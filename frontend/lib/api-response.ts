import { CollectionMember } from "./models";

export type AddCollectionResponse = {
  id: number;
  name: string;
  members: CollectionMember[];
  created_at: string;
  updated_at: string;
};
