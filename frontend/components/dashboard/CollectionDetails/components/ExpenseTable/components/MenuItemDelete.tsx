"use client";
import { useToast } from "@/components/ui/use-toast";
import { Expense } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

const deleteExpense = (token: string, expenseID: number) => {
  return async () => {
    const res = await fetch(apiURL(`/expense/${expenseID}/`), {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (res.status >= 300) throw new Error("Cant delete, OMG");
    return {};
  };
};

export function MenuItemDelete({
  token,
  expense,
  expensePeriod,
}: {
  token: string;
  expense: Expense;
  expensePeriod: string;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense(token, expense.id),
    onMutate: async () => {
      await queryClient.cancelQueries([
        EXPENSES_KEY,
        expense.group.id,
        expensePeriod,
        token,
      ]);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([
        EXPENSES_KEY,
        expense.group.id,
        expensePeriod,
        token,
      ]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `could not delete expense: ${expense.title}`,
      });
    },
  });
  return (
    <DropdownMenuItem className="px-1 hover:font-semibold bg-red-50 rounded">
      <button
        onClick={() => mutation.mutate()}
        className="flex items-center text-red-500"
      >
        <X height={20} width={20} />
        Delete
      </button>
    </DropdownMenuItem>
  );
}
