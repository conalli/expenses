"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/loading/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCategory } from "@/hooks/use-category";
import { useCurrency } from "@/hooks/use-currency";
import { useUser } from "@/hooks/use-user";
import { Expense } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { generateStep } from "@/lib/currency";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UpdateExpenseRequest = {
  id: number;
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

const updateExpense = (token: string) => {
  return async (data: UpdateExpenseRequest) => {
    const amount = Number(data.amount);
    const cleanedData = {
      ...data,
      amount,
      date: format(data.date, "yyyy-MM-dd"),
    };
    console.log("clec", cleanedData);
    const res = await fetch(apiURL(`/expense/${cleanedData.id}/`), {
      method: "PUT",
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

export function UpdateExpenseDialog({
  setOpen,
  setMenuOpen,
  token,
  collectionID,
  expensePeriod,
  expense,
}: {
  setOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  token: string;
  collectionID: string;
  expensePeriod: string;
  expense: Expense;
}) {
  const { user } = useUser();
  const currencies = useCurrency(user);
  const categories = useCategory(user);
  const defaultValues = {
    ...expense,
    amount: String(expense.amount),
    category_id: expense.category.id.toString(),
    currency_id: expense.currency.id.toString(),
    created_by_id: expense.created_by.id,
    paid_by_id: null,
    group_id: expense.group.id,
    date: new Date(expense.date),
  };
  const form = useForm<UpdateExpenseRequest>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateExpense(token),
    onMutate: async () => {
      await queryClient.cancelQueries([
        EXPENSES_KEY,
        Number(collectionID),
        expensePeriod,
        token,
      ]);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([
        EXPENSES_KEY,
        Number(collectionID),
        expensePeriod,
        token,
      ]);
    },
    onSuccess: () => {
      form.reset(defaultValues);
      setOpen(false);
      setMenuOpen(false);
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="pb-4">
          Update Expense - {expense.title}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const curr = currencies.data?.find(
              (c) => c.id === Number(data.currency_id)
            );
            let amount = Number(data.amount);
            if (curr && curr.decimals > 0) {
              amount *= 10 ** curr.decimals;
            }
            mutation.mutate({
              ...defaultValues,
              ...data,
              amount: String(amount),
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
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.data?.map((c) => {
                      return (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.data?.map((c) => {
                      return (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.symbol} - {c.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
                      currencies.data?.find(
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date of your Expense.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2 pt-4">
            <Button
              type="submit"
              disabled={mutation.isLoading}
              className="flex gap-2 w-full bg-amber-500 hover:bg-amber-500/90"
            >
              <Pencil size={16} />
              Update
              {mutation.isLoading && (
                <Spinner color="text-white" containerStyles="py-4" />
              )}
            </Button>
            <Button
              type="button"
              disabled={mutation.isLoading}
              onClick={() => {
                form.reset(defaultValues);
                setOpen(false);
                setMenuOpen(false);
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
