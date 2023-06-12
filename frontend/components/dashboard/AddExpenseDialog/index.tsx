import {
  Category,
  Collection,
  Currency,
  Expense,
  UserWithToken,
} from "@/lib/api/models";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { DatePicker } from "../../ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { ExpensePeriod } from "../CollectionDetails";

const generateStep = (currency?: Currency): number => {
  if (!currency) return 0.01;
  let step: number;
  switch (currency.decimals) {
    case 0:
      step = 1;
      break;
    case 3:
      step = 0.001;
      break;
    default:
      step = 0.01;
      break;
  }
  return step;
};

type AddExpenseRequest = {
  title: string;
  description?: string;
  amount: number;
  paid: boolean;
  paid_by_id: number | null;
  date: Date;
  category_id: number;
  currency_id: number;
  group_id: number;
  created_by_id: number;
};

const addExpense = (token: string) => {
  return async (data: AddExpenseRequest) => {
    const res = await fetch("/api/expense/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.status >= 300) throw new Error("OMG CANT ADD");
    return (await res.json()) as Expense;
  };
};

export function AddExpenseDialog({
  type,
  user,
  expensePeriod,
  collection,
  categories,
  currencies,
}: {
  type: "default" | "receipt";
  user: UserWithToken;
  expensePeriod: ExpensePeriod;
  collection: Collection;
  categories: Category[];
  currencies: Currency[];
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addExpense(user.token),
    onMutate: async () => {
      await queryClient.cancelQueries([
        EXPENSES_KEY,
        collection.id,
        expensePeriod,
        user.token,
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries([
        EXPENSES_KEY,
        collection.id,
        expensePeriod,
        user.token,
      ]);
    },
    // onSuccess: () => {},
    // onError: () => {},
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <span className="flex gap-2 items-center">
            <Plus size={24} />
            Add Expense
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            Add Expense to {collection.name}?
          </DialogTitle>
          <DialogDescription>
            This will add it to your
            <strong> Collection </strong>.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="title">Title</Label>
        <Input placeholder="title" type="text" className="italic" id="title" />
        <Label htmlFor="description">Description</Label>
        <Textarea
          placeholder="description"
          className="italic"
          id="description"
        />
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => {
              return (
                <SelectItem key={c.id} value={JSON.stringify(c)}>
                  {c.title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue className="" placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => {
                return (
                  <SelectItem key={c.id} value={JSON.stringify(c)}>
                    {c.symbol}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Label htmlFor="amount">Amount</Label>
          <Input
            className="grow-[2]"
            placeholder="amount"
            type="number"
            step={
              selectedCurrency &&
              generateStep(JSON.parse(selectedCurrency) as Currency)
            }
            id="amount"
          />
        </div>
        <Label htmlFor="date">Date</Label>
        <DatePicker date={date} setDate={setDate} />
        <div className="flex justify-between gap-2">
          <Button
            onClick={() => {
              const category =
                selectedCategory && (JSON.parse(selectedCategory) as Category);
              const currency =
                selectedCurrency && (JSON.parse(selectedCurrency) as Currency);
              mutation.mutate({
                group_id: collection.id,
                paid_by_id: null,
                category_id: category ? category.id : 0,
                currency_id: currency ? currency.id : 0,
                created_by_id: user.id,
                amount: 11111,
                title: "",
                paid: false,
                date: date ?? new Date(),
              });
            }}
            className="flex gap-2 w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus size={24} />
            Add
          </Button>
          <Button onClick={() => setOpen(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
