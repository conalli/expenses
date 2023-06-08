import { useEffect, useState } from "react";
import { Collection, Expense } from "../../lib/models";
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

export function CollectionDetails({
  collection,
  token,
}: {
  collection: Collection;
  token: string;
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const sinceDate = new Date(collection.created_at);
  const localeDate = new Intl.DateTimeFormat("ja-JP").format(sinceDate);

  useEffect(() => {
    getGroupExpenses(token, collection.id).then((data) => setExpenses(data));
  }, [collection, token]);

  return (
    <div>
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold py-6">{collection.name}</h1>
        <p className="text-sm text-muted-foreground">created: {localeDate}</p>
      </div>
      {expenses.length > 0 ? <ExpenseTable expenses={expenses} /> : null}
    </div>
  );
}
