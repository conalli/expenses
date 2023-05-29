import { Expense } from "../../lib/models";
import { DataTable } from "./DataTable";
import { columns } from "./ExpenseColumn";

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return <DataTable columns={columns} data={expenses} />;
}
