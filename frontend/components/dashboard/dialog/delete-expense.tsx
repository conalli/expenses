"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/loading/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Expense } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const DELETE_EXPENSE_TEXT = "delete";

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

type DeleteExpenseDialogProps = {
  setOpen: (open: boolean) => void;
  setMenuOpen: (close: boolean) => void;
  token: string;
  expense: Expense;
  expensePeriod: string;
};

export function DeleteExpenseDialog({
  setOpen,
  setMenuOpen,
  token,
  expense,
  expensePeriod,
}: DeleteExpenseDialogProps) {
  const [deleteText, setDeleteText] = useState("");
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
    onSuccess: () => {
      setOpen(false);
      setMenuOpen(false);
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
    <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle className="pb-4">Are you sure?</DialogTitle>
        <DialogDescription>
          This will permanently delete
          <strong> {expense.title} </strong>.
        </DialogDescription>
        <DialogDescription>
          To delete, type &quot;
          <i>{DELETE_EXPENSE_TEXT}</i>&quot; in the box below.
        </DialogDescription>
      </DialogHeader>
      <Input
        placeholder={DELETE_EXPENSE_TEXT}
        value={deleteText}
        onChange={(e) => setDeleteText(e.target.value)}
        className="italic"
      />
      <div className="flex justify-between gap-2">
        <Button
          variant="destructive"
          className="w-full flex gap-4"
          disabled={DELETE_EXPENSE_TEXT !== deleteText || mutation.isLoading}
          onClick={() => mutation.mutate()}
        >
          Delete
          {mutation.isLoading && (
            <Spinner color="text-white" containerStyles="py-4" />
          )}
        </Button>
        <Button
          disabled={mutation.isLoading}
          onClick={() => {
            setOpen(false);
            setMenuOpen(false);
          }}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  );
}
