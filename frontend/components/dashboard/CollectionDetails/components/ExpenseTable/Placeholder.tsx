import { DataTable } from "@/components/ui/data-table";
import { Collection, Expense, User } from "@/lib/api/models";
import { columns } from "./components/ExpenseColumn";

type PlaceholderProps = {
  user: User;
  collection: Collection;
};

type PlaceholderData = Expense & { token: string; expensePeriod: string };

export function Placeholder({ user, collection }: PlaceholderProps) {
  const placeholderExpenses: PlaceholderData[] = [
    {
      token: "",
      expensePeriod: "1",
      id: 0,
      title: "Nothing",
      description:
        "You have no expenses for this period. Click 'Add' to get started.",
      amount: 0,
      receipt_url: "",
      category: {
        id: 0,
        title: "None",
        public: false,
        group: null,
        created_by: null,
      },
      currency: {
        id: 0,
        name: "",
        decimals: 0,
        symbol: "",
      },
      paid: false,
      paid_by: null,
      date: new Date().toLocaleDateString("ja-JP"),
      created_by: user,
      group: collection,
    },
  ];
  return (
    <div className="bg-red-100">
      <DataTable columns={columns} data={placeholderExpenses} />
    </div>
  );
}
