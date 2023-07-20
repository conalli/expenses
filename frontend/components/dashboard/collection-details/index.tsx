import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collection, Expense, UserWithToken } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, Table } from "lucide-react";
import DataTab from "./data-tab";
import TableTab from "./table-tab";

const getGroupExpenses = (token: string, groupID: number, params = "") => {
  return async (): Promise<Expense[]> => {
    const response = await fetch(
      apiURL(`/group/${groupID}/expenses${params}`),
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    if (response.status !== 200) throw new Error("OMG");
    return response.json() as Promise<Expense[]>;
  };
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
    <Tabs defaultValue="table" className="flex flex-col gap-3">
      <div className="flex items-center gap-6 w-1/2">
        <TabsList>
          <TabsTrigger value="table">
            <Table />
          </TabsTrigger>
          <TabsTrigger value="data">
            <BarChart2 />
          </TabsTrigger>
        </TabsList>
        <Select onValueChange={handlePeriodSelect}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder={`This month - ${currentMonth}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"month"}>This month - {currentMonth}</SelectItem>
            <SelectItem value={"year"}>This year - {currentYear}</SelectItem>
            <SelectItem value={""}>All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TabsContent value="table">
        <TableTab
          user={user}
          collection={collection}
          expenses={expenses}
          isLoading={isLoading}
          expensePeriod={expensePeriod}
        />
      </TabsContent>
      <TabsContent value="data">
        <DataTab expenses={expenses} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
