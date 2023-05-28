import { useEffect, useState } from "react";
import { Expense, Group } from "../models";
import ExpenseTable from "./ExpenseTable";

const getGroupExpenses = async (
  token: string,
  groupID: number
): Promise<Expense[]> => {
  const response = await fetch(`/api/group/${groupID}/expenses`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (response.status !== 200) throw new Error("OMG");
  return response.json() as Promise<Expense[]>;
};

export default function GroupDetails({
  group,
  token,
}: {
  group: Group | null;
  token: string;
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    if (!group) return;
    getGroupExpenses(token, group.id).then((data) => setExpenses(data));
  }, [group, token]);
  if (!group) return null;
  return (
    <div>
      {expenses.length > 0 ? <ExpenseTable expenses={expenses} /> : null}
    </div>
  );
}
