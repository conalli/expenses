import { Group } from "./User";

export default function GroupsList({ groups }: { groups?: Group[] }) {
  if (!groups) return null;
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.id}>{group.name}</li>
      ))}
    </ul>
  );
}
