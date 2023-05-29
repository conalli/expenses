import { Group } from "../../lib/models";

export function GroupList({
  groups,
  selectedGroup,
  selectGroup,
}: {
  groups?: Group[];
  selectedGroup: Group;
  selectGroup: (group: Group) => void;
}) {
  if (!groups) return null;
  return (
    <ul className="h-screen flex flex-col justify-center gap-10 px-8 bg-stone-100 text-white">
      <li className="font-bold text-xl text-black">Groups:</li>
      {groups.map((group) => (
        <li
          key={group.id}
          className={
            selectedGroup.id === group.id
              ? "text-emerald-600 font-semibold"
              : "text-black"
          }
        >
          <button onClick={() => selectGroup(group)}>{group.name}</button>
          {group.members.map((m) => (
            <p key={m.id}>-{m.username}</p>
          ))}
        </li>
      ))}
    </ul>
  );
}
