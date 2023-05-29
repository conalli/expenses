"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "../../lib/models";

const amountToCurrency = (amount: number, decimals: number): string => {
  const total = amount / 10 ** decimals;
  return total.toFixed(decimals);
};

const displayAmount = (symbol: string, currencyAmount: string) => {
  return `${symbol}${currencyAmount}`;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Amount",
    accessorFn: ({ amount, currency }) =>
      displayAmount(
        currency.symbol,
        amountToCurrency(amount, currency.decimals)
      ),
    cell: ({ getValue }) => (
      <div className="text-left font-medium">{getValue<string>()}</div>
    ),
  },
  {
    accessorFn: (row) => row.category.title,
    header: "Category",
  },
  {
    accessorFn: (row) =>
      new Intl.DateTimeFormat(["ja-JP"], {
        dateStyle: "short",
      }).format(new Date(row.date)),
    header: "Date",
  },
];
