import { EXPENSES_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { Collection, Expense, UserWithToken } from "../../../lib/api/models";
import { Loader } from "../../ui/loading/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ExpenseTable } from "./components/ExpenseTable";
import { Placeholder } from "./components/ExpenseTable/Placeholder";

const getGroupExpenses = (token: string, groupID: number, params = "") => {
  return async (): Promise<Expense[]> => {
    const response = await fetch(`/api/group/${groupID}/expenses${params}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.status !== 200) throw new Error("OMG");
    return response.json() as Promise<Expense[]>;
  };
};

const createdDate = (createdDate: string): string => {
  const sinceDate = new Date(createdDate);
  return new Intl.DateTimeFormat("ja-JP").format(sinceDate);
};

export type ExpensePeriod = "month" | "year" | "" | undefined;

const expensePeriodToString = (period: ExpensePeriod): string => {
  const date = new Date();
  let dateString: string;
  switch (period) {
    case "month":
      dateString = (1 + date.getMonth()).toString();
      break;
    case "year":
      dateString = date.getFullYear().toString();
      break;
    default:
      dateString = "";
  }
  return dateString;
};

const periodToParam = (period: string): string => {
  if (period.length === 0) return period;
  if (period.length <= 2) return `?month=${period}`;
  return `?year=${period}`;
};

export function CollectionDetails({
  collection,
  user,
  expensePeriod,
  setExpensePeriod,
}: {
  collection: Collection;
  user: UserWithToken;
  expensePeriod: ExpensePeriod;
  setExpensePeriod: (period: ExpensePeriod) => void;
}) {
  const { data: expenses, isLoading } = useQuery({
    queryKey: [EXPENSES_KEY, collection.id, expensePeriod, user.token],
    queryFn: getGroupExpenses(
      user.token,
      collection.id,
      periodToParam(expensePeriodToString(expensePeriod))
    ),
  });

  const currentMonth = new Date().toLocaleDateString(
    ["en-GB", "en-US", "ja-JP"],
    {
      month: "long",
    }
  );

  const currentYear = new Date().toLocaleDateString(
    ["en-GB", "en-US", "ja-JP"],
    {
      year: "numeric",
    }
  );

  const handlePeriodSelect = (value: string): void => {
    const period = value as ExpensePeriod;
    setExpensePeriod(period);
  };

  return (
    <div>
      <div className="py-6 flex items-center">
        <h1 className="inline text-2xl font-bold py-6 grow">
          {collection.name}
        </h1>
        <p className="inline px-4 text-sm text-muted-foreground">
          created: {createdDate(collection.created_at)}
        </p>
        <Select value={expensePeriod} onValueChange={handlePeriodSelect}>
          <SelectTrigger>
            <SelectValue placeholder={`This month - ${currentMonth}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"month"}>This month - {currentMonth}</SelectItem>
            <SelectItem value={"year"}>This year - {currentYear}</SelectItem>
            <SelectItem value={""}>All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading && <Loader />}
      {expenses && expenses.length > 0 ? (
        <ExpenseTable
          token={user.token}
          expenses={expenses}
          expensePeriod={expensePeriodToString(expensePeriod)}
        />
      ) : (
        <Placeholder user={user} collection={collection} />
      )}
    </div>
  );
}
