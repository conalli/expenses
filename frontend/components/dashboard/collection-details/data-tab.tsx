import { Expense } from "@/lib/api/models";
import { ExpenseData } from "./expense-data";
import LoadingTab from "./loading-tab";

export default function DataTab({
  expenses,
  isLoading,
}: {
  expenses?: Expense[];
  isLoading: boolean;
}) {
  if (!expenses || isLoading) return <LoadingTab />;
  if (expenses.length <= 0) return <ExpenseData expenses={expenses} />;
  return <ExpenseData expenses={expenses} />;
}
