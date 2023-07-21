import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency, Expense } from "@/lib/api/models";
import { useState } from "react";
import {
  Line,
  LineChart,
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
  category: string;
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
  const yearlyTotal = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .filter((e) => new Date(e.date).getFullYear() === now.getFullYear());
  const monthlyTotal = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .filter((e) => new Date(e.date).getMonth() === now.getMonth());
  const lastFive = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .reverse()
    .slice(0, 5);
  const monthlyExpenses = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .reduce((prev, curr) => {
      const month = new Date(curr.date).getMonth();
      prev[month].amount += curr.amount / 10 ** prev[month].currency.decimals;
      return prev;
    }, defaultExpenseByMonth(selectedCurrency));

  const monthlyAverage =
    monthlyExpenses.reduce((prev, curr) => prev + curr.amount, 0) / 12;

  const categoryTotals = expenses
    .filter((e) => e.currency.id === selectedCurrency?.id)
    .reduce((prev, curr) => {
      const category = prev.find((p) => p.category === curr.category.title);
      if (category) {
        category.amount += curr.amount / 10 ** curr.currency.decimals;
        return prev;
      }
      prev.push({
        category: curr.category.title,
        currency: curr.currency,
        amount: curr.amount / 10 ** curr.currency.decimals,
      });
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
            {calcExpenseTotal(yearlyTotal).map((amt) => (
              <p className="text-xl font-bold" key={"year" + amt.currency.id}>
                {new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: amt.currency.name,
                }).format(amt.amount)}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle className="text-slate-700/90">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold" key={"month" + monthlyAverage}>
              {selectedCurrency &&
                new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: selectedCurrency.name,
                }).format(monthlyAverage)}
            </p>
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle className="text-slate-700/90">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            {calcExpenseTotal(monthlyTotal).map((amt) => (
              <p className="text-xl font-bold" key={"month" + amt.currency.id}>
                {new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: amt.currency.name,
                }).format(amt.amount)}
              </p>
            ))}
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
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
