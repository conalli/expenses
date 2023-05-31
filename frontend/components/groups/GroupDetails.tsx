import { useEffect, useState } from "react";
import { Expense, Group } from "../../lib/models";
import { ExpenseTable } from "../expenses/ExpenseTable";

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

export function GroupDetails({
  group,
  token,
}: {
  group: Group;
  token: string;
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    getGroupExpenses(token, group.id).then((data) => setExpenses(data));
  }, [group, token]);
  return (
    <div>
      {expenses.length > 0 ? <ExpenseTable expenses={expenses} /> : null}
    </div>
  );
}
