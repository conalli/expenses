"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useDialog } from "@/hooks/use-dialog";
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
  token: string;
  expense: Expense;
  expensePeriod: string;
};

export function DeleteExpenseDialog({
  token,
  expense,
  expensePeriod,
}: DeleteExpenseDialogProps) {
  const { open, setOpen, type } = useDialog();
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
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `could not delete expense: ${expense.title}`,
      });
    },
  });
  return (
    <Dialog
      open={open && type === "delete-expense"}
      onOpenChange={(open) => {
        console.log("called");
        setOpen(open, "delete-expense");
      }}
    >
      <DialogContent>
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
            className="w-full"
            disabled={DELETE_EXPENSE_TEXT !== deleteText}
            onClick={() => mutation.mutate()}
          >
            Delete
          </Button>
          <Button onClick={() => setOpen(false, null)} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
