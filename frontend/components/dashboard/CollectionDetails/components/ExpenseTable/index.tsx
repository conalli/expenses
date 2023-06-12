import { Expense } from "../../../../../lib/api/models";
import { DataTable } from "../../../../ui/data-table";
import { columns } from "./components/ExpenseColumn";

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return <DataTable columns={columns} data={expenses} />;
}
