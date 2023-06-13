"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Expense } from "../../../../../../lib/api/models";
import { Button } from "../../../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../ui/dropdown-menu";

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

export const columns: ColumnDef<Expense>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Description",
    accessorKey: "description",
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("hi", expense.title)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("bye", expense.description)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];