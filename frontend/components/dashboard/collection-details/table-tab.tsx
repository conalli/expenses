import { Collection, Expense, UserWithToken } from "@/lib/api/models";
import { ExpensePeriod } from ".";
import { ExpenseTable } from "./expense-table";
import { TablePlaceholder } from "./expense-table/placeholder";
import LoadingTab from "./loading-tab";

export default function TableTab({
  user,
  collection,
  expenses,
  isLoading,
  expensePeriod,
}: {
  user: UserWithToken;
  collection: Collection;
  expenses?: Expense[];
  isLoading: boolean;
  expensePeriod: ExpensePeriod;
}) {
  if (!expenses || isLoading) return <LoadingTab />;
  if (expenses.length <= 0)
    return <TablePlaceholder user={user} collection={collection} />;
  return (
    <ExpenseTable
      token={user.token}
      expenses={expenses}
      expensePeriod={expensePeriod ?? ""}
    />
  );
}
