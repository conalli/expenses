import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency, Expense } from "@/lib/api/models";
import { stringToColor } from "@/lib/styles";
import { useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CurrencyAmount = {
  currency: Currency;
  amount: number;
};

type MonthlyCurrencyAmount = CurrencyAmount & {
  month: string;
};

type CategoryCurrencyAmount = CurrencyAmount & {
  name: string;
  fill: string;
};

const calcExpenseTotal = (exp: Expense[]): CurrencyAmount[] => {
  return exp.reduce((prev, curr) => {
    const found = prev.find((v) => v.currency.id === curr.currency.id);
    if (found) {
      found.amount += curr.amount / 10 ** curr.currency.decimals;
      return prev;
    }
    prev.push({
      currency: curr.currency,
      amount: curr.amount / 10 ** curr.currency.decimals,
    });
    return prev;
  }, [] as CurrencyAmount[]);
};

const defaultExpenseByMonth = (currency: Currency) => {
  const date = new Date();
  const out = new Array(12) as MonthlyCurrencyAmount[];
  for (let i = 0; i < 12; ++i) {
    date.setMonth(i);
    out[i] = {
      currency: currency,
      amount: 0,
      month: date.toLocaleString("en-GB", { month: "short" }),
    } as MonthlyCurrencyAmount;
  }
  return out;
};

export function ExpenseData({ expenses }: { expenses: Expense[] }) {
  const currencies = expenses.reduce((prev, curr) => {
    const found = prev.find((c) => c.id === curr.currency.id);
    if (found) {
      return prev;
    }
    prev.push(curr.currency);
    return prev;
  }, [] as Currency[]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const now = new Date();

  const yearlyTotal = expenses.filter(
    (e) =>
      e.currency.id === selectedCurrency?.id &&
      new Date(e.date).getFullYear() === now.getFullYear()
  );

  const monthlyTotal = expenses.filter(
    (e) =>
      e.currency.id === selectedCurrency?.id &&
      new Date(e.date).getMonth() === now.getMonth()
  );

  const monthlyExpenses = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .reduce((prev, curr) => {
      const month = new Date(curr.date).getMonth();
      prev[month].amount += curr.amount / 10 ** prev[month].currency.decimals;
      return prev;
    }, defaultExpenseByMonth(selectedCurrency));

  const monthlyAverage =
    monthlyExpenses.reduce((prev, curr) => prev + curr.amount, 0) / 12;

  const lastExpenses = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .reverse()
    .slice(0, 3);

  const categoryTotal = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .reduce((prev, curr) => {
      const found = prev.find((e) => e.name === curr.category.title);
      if (found) {
        found.amount += curr.amount / 10 ** curr.currency.decimals;
        return prev;
      }
      prev.push({
        name: curr.category.title,
        amount: curr.amount / 10 ** curr.currency.decimals,
        fill: stringToColor(curr.category.title),
      } as CategoryCurrencyAmount);
      return prev;
    }, [] as CategoryCurrencyAmount[]);

  return (
    <div className="flex flex-col gap-4">
      <Select
        defaultValue={selectedCurrency?.id.toString()}
        onValueChange={(id) =>
          setSelectedCurrency(
            (prev) => currencies.find((c) => String(c.id) === id) ?? prev
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={selectedCurrency?.symbol} />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((c) => (
            <SelectItem key={c.id + "select"} value={String(c.id)}>
              {c.symbol}
              &nbsp;
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-4">
        <Card className="grow">
          <CardHeader>
            <CardTitle className="text-slate-700/90">Yearly Total</CardTitle>
          </CardHeader>
          <CardContent>
            {yearlyTotal.length ? (
              calcExpenseTotal(yearlyTotal).map((amt) => (
                <p className="text-xl font-bold" key={"year" + amt.currency.id}>
                  {new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: amt.currency.name,
                  }).format(amt.amount)}
                </p>
              ))
            ) : (
              <p className="text-xl font-bold">N/A</p>
            )}
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle className="text-slate-700/90">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold" key={"month" + monthlyAverage}>
              {selectedCurrency
                ? new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: selectedCurrency.name,
                  }).format(monthlyAverage)
                : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle className="text-slate-700/90 flex items-center">
              Monthly Total &nbsp;
              <p className="text-sm text-slate-700/50">
                ({now.toLocaleString("en-GB", { month: "long" })})
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyTotal.length ? (
              calcExpenseTotal(monthlyTotal).map((amt) => (
                <p
                  className="text-xl font-bold"
                  key={"month" + amt.currency.id}
                >
                  {new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: amt.currency.name,
                  }).format(amt.amount)}
                </p>
              ))
            ) : (
              <p className="text-xl font-bold">N/A</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="grow-[1]">
          <CardHeader>
            <CardTitle className="text-slate-700/90">
              This Years Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyExpenses}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey={"amount"} stroke="#059669" />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("ja-JP", {
                      style: "currency",
                      currency: selectedCurrency?.name,
                    }).format(Number(value))
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="grow-[2]">
          <CardHeader>
            <CardTitle>Last {lastExpenses.length} Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {!categoryTotal.length ? (
              "N/A"
            ) : (
              <div className="flex flex-col justify-between">
                {lastExpenses.map((e) => (
                  <Card key={e.id} className="flex items-center">
                    <CardHeader className="w-1/2">
                      <CardTitle>{e.title}</CardTitle>
                      <CardDescription>{e.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-end pt-6 text-lg font-bold w-1/2">
                      {new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: e.currency.name,
                      }).format(e.amount / 10 ** e.currency.decimals)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>

          <CardContent>
            {!categoryTotal.length ? (
              "N/A"
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart height={10} width={10}>
                  <Pie
                    data={categoryTotal}
                    dataKey={"amount"}
                    label
                    cx="50%"
                    cy="50%"
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("ja-JP", {
                        style: "currency",
                        currency: selectedCurrency?.name,
                      }).format(Number(value))
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
