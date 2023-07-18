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
import { Loader } from "@/components/ui/loading/Loader";
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
import { format } from "date-fns";
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
    const amount = Number(data.amount);
    const cleanedData = {
      ...data,
      amount,
      date: format(data.date, "yyyy-MM-dd"),
    };
    const res = await fetch("/api/expense/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    });
    if (res.status >= 300) throw new Error("OMG CANT ADD");
    return (await res.json()) as Expense;
  };
};

const defaultFields = (userID: number, collectionID: number) => ({
  title: "",
  description: "",
  amount: "0",
  paid: false,
  paid_by_id: null,
  date: undefined,
  category_id: "1",
  currency_id: "1",
  group_id: collectionID,
  created_by_id: userID,
});

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
  const form = useForm<AddExpenseRequest>({
    resolver: zodResolver(schema),
    defaultValues: defaultFields(user.id, collection.id),
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
    onSuccess: () => {
      form.reset(defaultFields(user.id, collection.id));
      setOpen(false);
    },
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
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 text-primary-foreground hover:bg-emerald-600/90 bg-emerald-600">
          <span className="flex gap-2 items-center">
            <Plus size={24} />
            Add Expense
          </span>
        </div>
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
            onSubmit={form.handleSubmit((data) => {
              const curr = currencies.find(
                (c) => c.id === Number(data.currency_id)
              );
              let amount = Number(data.amount);
              if (curr && curr.decimals > 0) {
                amount *= 10 ** curr.decimals;
              }
              mutation.mutate({
                ...data,
                amount: String(amount),
                paid_by_id: null,
                group_id: collection.id,
                created_by_id: user.id,
              });
            })}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
                              {c.symbol} - {c.name}
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
                      step={generateStep(
                        currencies.find(
                          (c) => c.id == Number(form.getValues()["currency_id"])
                        )
                      )}
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
            <div className="flex justify-between gap-2 pt-4">
              <Button
                type="submit"
                className="flex gap-2 w-full bg-emerald-600 hover:bg-emerald-600/90"
              >
                <Plus size={24} />
                Add
                {mutation.isLoading && (
                  <Loader color="text-white" containerStyles="py-4" />
                )}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  form.reset(defaultFields(user.id, collection.id));
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
