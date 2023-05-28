import { Expense } from "../models";
import { DataTable } from "./DataTable";
import { columns } from "./ExpenseColumn";

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  console.log("E", expenses);

  return <DataTable columns={columns} data={expenses} />;
}
