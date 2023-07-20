import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency, Expense } from "@/lib/api/models";
import { BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type CurrencyAmount = {
  currency: Currency;
  amount: number;
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

type MonthlyTotal = {
  month: number;
  total: string;
};

const defaultExpenseByMonth = () => {
  const out = [] as MonthlyTotal[];
  for (let i = 1; i <= 12; ++i) {
    out.push({ month: i, total: "" });
  }
  return out;
};

export function ExpenseData({ expenses }: { expenses: Expense[] }) {
  const now = new Date();
  const yearlyExpenses = expenses.filter(
    (e) => new Date(e.date).getFullYear() === now.getFullYear()
  );
  const monthlyExpenses = expenses.filter(
    (e) => new Date(e.date).getMonth() === now.getMonth()
  );
  const lastFive = expenses.reverse().slice(0, 5);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Card className="grow">
          <CardHeader>
            <CardTitle>Yearly Total</CardTitle>
          </CardHeader>
          <CardContent>
            {calcExpenseTotal(yearlyExpenses).map((amt) => (
              <p key={"year" + amt.currency.id}>
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
            <CardTitle>Monthly Average</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            {calcExpenseTotal(monthlyExpenses).map((amt) => (
              <p key={"month" + amt.currency.id}>
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
            <CardTitle>Weekly Total</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="grow-[2]">
          <CardHeader>
            <CardTitle>This Years Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%">
              <BarChart data={expenses}>
                <XAxis dataKey="amount" />
                <YAxis />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Last 5 Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {lastFive.map((amt, idx) => (
              <p key={"top" + idx}>
                {new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: amt.currency.name,
                }).format(amt.amount / 10 ** amt.currency.decimals)}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
