import { DataTable } from "@/components/ui/data-table";
import { Expense } from "@/lib/api/models";
import { columns } from "./components/ExpenseColumn";

export function ExpenseTable({
  token,
  expenses,
  expensePeriod,
}: {
  token: string;
  expenses: Expense[];
  expensePeriod: string;
}) {
  const expenseWithTokens = expenses.map((e) => ({
    ...e,
    token,
    expensePeriod,
  }));
  return <DataTable columns={columns} data={expenseWithTokens} />;
}
