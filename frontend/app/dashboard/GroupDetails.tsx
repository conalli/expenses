import { Group } from "./User";

const getGroupExpenses = async (token: string, groupID: number) => {
  const response = await fetch(`/api/group/${groupID}/expenses`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export default function GroupDetails({ group }: { group: Group | null }) {
  if (!group) return null;
  return <div></div>;
}
