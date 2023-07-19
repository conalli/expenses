"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Expense } from "@/lib/api/models";
import { ColumnDef } from "@tanstack/react-table";
import { ActionMenu } from "./action-menu";

const amountToCurrency = (amount: number, decimals: number): string => {
  const total = amount / 10 ** decimals;
  return total.toFixed(decimals);
};

const displayAmount = (symbol: string, currencyAmount: string): string => {
  return `${symbol}${currencyAmount}`;
};

const formatServerDate = (date: string): string => {
  return new Intl.DateTimeFormat(["ja-JP"], {
    dateStyle: "short",
  }).format(new Date(date));
};

export const columns: ColumnDef<
  Expense & { token: string; expensePeriod: string }
>[] = [
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ getValue }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p className="max-w-[15ch] font-bold text-slate-700/80 truncate">
              {getValue<string>()}
            </p>
          </TooltipTrigger>
          <TooltipContent>{getValue<string>()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p className="max-w-[15ch] truncate">{getValue<string>()}</p>
          </TooltipTrigger>
          <TooltipContent>{getValue<string>()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
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
    header: "Category",
    accessorFn: (row) => row.category.title,
  },
  {
    header: "Date",
    accessorFn: (row) => formatServerDate(row.date),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;
      if (expense.id === 0) return null;
      return <ActionMenu expense={expense} />;
    },
  },
];
