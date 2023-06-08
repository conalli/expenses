import { CollectionMember } from "@/lib/models";
import { CollectionMemberAvatar } from "./CollectionMemberAvatar";

export function CollectionMembersList({
  members,
}: {
  members: CollectionMember[];
}) {
  return (
    <ul className="flex gap-1 -space-x-2">
      {members.map((m) => (
        <CollectionMemberAvatar key={m.id} member={m} />
      ))}
    </ul>
  );
}
