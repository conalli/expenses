import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Expense } from "@/lib/api/models";
import { MoreHorizontal, Pencil, X } from "lucide-react";
import { useState } from "react";
import { DeleteExpenseDialog } from "../../dialog/delete-expense";
import { UpdateExpenseDialog } from "../../dialog/update-expense";

type ActionMenuProps = {
  expense: Expense & {
    token: string;
    expensePeriod: string;
  };
};

export type DialogType = "update-expense" | "delete-expense" | null;

export function ActionMenu({ expense }: ActionMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => setMenuOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem className="px-1 bg-amber-50 rounded">
              <div
                className="flex grow items-center gap-2 text-amber-500 hover:font-semibold hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setUpdateOpen(true);
                }}
              >
                <Pencil height={20} width={20} />
                Edit
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
          <UpdateExpenseDialog
            setOpen={setUpdateOpen}
            setMenuOpen={setMenuOpen}
            token={expense.token}
            collectionID={expense.group.id.toString()}
            expense={expense}
            expensePeriod={expense.expensePeriod}
          />
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem className="px-1 bg-red-50 rounded">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteOpen(true);
                }}
                className="flex items-center gap-2 text-red-500 hover:font-semibold hover:cursor-pointer"
              >
                <X height={20} width={20} />
                Delete
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
          <DeleteExpenseDialog
            setOpen={setDeleteOpen}
            setMenuOpen={setMenuOpen}
            token={expense.token}
            expense={expense}
            expensePeriod={expense.expensePeriod}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
