import { Expense } from "@/lib/api/models";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function MenuItemEdit({ expense }: { expense: Expense }) {
  return <DropdownMenuItem>Edit</DropdownMenuItem>;
}

export default MenuItemEdit;
