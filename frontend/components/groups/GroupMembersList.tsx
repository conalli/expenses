import { GroupMember } from "@/lib/models";
import { MemberAvatar } from "./MemberAvatar";

export function GroupMembersList({ members }: { members: GroupMember[] }) {
  return (
    <ul className="flex gap-1 -space-x-2">
      {members.map((m) => (
        <MemberAvatar key={m.id} member={m} />
      ))}
    </ul>
  );
}
