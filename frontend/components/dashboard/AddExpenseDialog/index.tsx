import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Category,
  Collection,
  Currency,
  Expense,
  UserWithToken,
} from "@/lib/api/models";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
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
  amount: string;
  paid: boolean;
  paid_by_id: number | null;
  date: Date;
  category_id: string;
  currency_id: string;
  group_id: number;
  created_by_id: number;
};

const schema = z.object({
  title: z.string().max(50),
  description: z.string().max(255).optional(),
  amount: z.string().default("0"),
  date: z.date(),
  category_id: z.string(),
  currency_id: z.string(),
});

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
  user,
  expensePeriod,
  collection,
  categories,
  currencies,
}: {
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
  const form = useForm<AddExpenseRequest>({
    resolver: zodResolver(schema),
  });
  const { toast } = useToast();
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
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "could not create new expense",
      });
    },
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => console.log("data", data))}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="title"
                      type="text"
                      className="italic"
                      id="title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give you Expense a regonizable title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="description"
                      className="italic"
                      id="description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your Expense for future reference (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => {
                          return (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.title}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose a Category for your Expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => {
                          return (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.symbol}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the Currency of your Expense.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="amount"
                      type="number"
                      step={
                        selectedCurrency &&
                        generateStep(JSON.parse(selectedCurrency) as Currency)
                      }
                      className="italic"
                      id="amount"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The total for your Expense.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>The date of your Expense.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-2">
              <Button
                type="submit"
                onClick={() => console.log(form.formState.errors)}
                // onClick={() => {
                //   const category =
                //     selectedCategory &&
                //     (JSON.parse(selectedCategory) as Category);
                //   const currency =
                //     selectedCurrency &&
                //     (JSON.parse(selectedCurrency) as Currency);
                //   mutation.mutate({
                //     group_id: collection.id,
                //     paid_by_id: null,
                //     category_id: category ? category.id : 0,
                //     currency_id: currency ? currency.id : 0,
                //     created_by_id: user.id,
                //     amount: 11111,
                //     title: "",
                //     paid: false,
                //     date: date ?? new Date(),
                //   });
                // }}
                className="flex gap-2 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus size={24} />
                Add
              </Button>
              <Button
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
