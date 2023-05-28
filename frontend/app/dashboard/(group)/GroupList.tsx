import { Group } from "../models";

export default function GroupList({
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
    <ul className="h-screen flex flex-col justify-center gap-10 px-8 bg-cyan-700 text-white">
      <li className="font-bold">Groups:</li>
      {groups.map((group) => (
        <li
          key={group.id}
          className={selectedGroup.id === group.id ? "text-cyan-100" : ""}
        >
          <button onClick={() => selectGroup(group)}>{group.name}</button>
        </li>
      ))}
    </ul>
  );
}
