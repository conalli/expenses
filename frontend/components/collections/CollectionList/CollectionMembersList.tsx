import { Collection } from "@/lib/models";
import { AddMemberDialog } from "./AddMemberDialog";
import { CollectionMemberAvatar } from "./CollectionMemberAvatar";

export function CollectionMembersList({
  token,
  collection,
  isSelected,
}: {
  token: string;
  collection: Collection;
  isSelected: boolean;
}) {
  return (
    <div className="flex w-full justify-between items-center">
      <ul className="flex gap-1 -space-x-2">
        {collection.members.map((m) => (
          <CollectionMemberAvatar key={m.id} member={m} />
        ))}
      </ul>
      <AddMemberDialog
        token={token}
        collection={collection}
        isSelected={isSelected}
      />
    </div>
  );
}
