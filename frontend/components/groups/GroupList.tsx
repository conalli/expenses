import { Group } from "../../lib/models";
import { GroupMembersList } from "./GroupMembersList";

export function GroupList({
  groups,
  selectedGroup,
  selectGroup,
}: {
  groups?: Group[];
  selectedGroup: Group | null;
  selectGroup: (group: Group) => void;
}) {
  if (!groups) return null;
  return (
    <ul className="h-screen flex flex-col justify-center gap-10 px-8 bg-stone-100 text-white">
      <li className="font-bold text-xl text-black">Groups:</li>
      {groups.map((group) => {
        const selected = selectedGroup?.id === group.id;
        return (
          <li
            key={group.id}
            className={
              selected ? "text-emerald-600 font-semibold" : "text-black"
            }
          >
            <button onClick={() => selectGroup(group)}>
              {selected && "・ "}
              {group.name}
            </button>
            <GroupMembersList members={group.members} />
          </li>
        );
      })}
    </ul>
  );
}
