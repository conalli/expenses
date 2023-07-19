import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/loading/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Category, Collection, UserWithToken } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Plus } from "lucide-react";
import { useState } from "react";
import { type ExpensePeriod } from "../collection-details";

type AddReceiptData = {
  collectionID: number;
  receipt: File;
  categoryID: number;
};

const addReceipt = (token: string) => {
  return async (data: AddReceiptData) => {
    const formData = new FormData();
    formData.set("receipt", data.receipt);
    formData.set("group_id", String(data.collectionID));
    formData.set("category_id", String(data.categoryID));
    const res = await fetch(apiURL(`/expense/receipt/`), {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    });
    if (res.status >= 300) throw new Error("OMG CANT POST RECEIPT");
    return res.json();
  };
};

export function AddReceiptDialog({
  user,
  expensePeriod,
  collection,
  categories,
}: {
  user: UserWithToken;
  expensePeriod: ExpensePeriod;
  collection: Collection;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addReceipt(user.token),
    onMutate: async () => {
      await queryClient.cancelQueries([
        EXPENSES_KEY,
        collection.id,
        expensePeriod,
        user.token,
      ]);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([
        EXPENSES_KEY,
        collection.id,
        expensePeriod,
        user.token,
      ]);
      setOpen(false);
    },
    onSuccess: () => {
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
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90">
          <span className="flex gap-2 items-center">
            <Camera size={24} />
            Add By Receipt
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
        <Label htmlFor="receipt">Receipt</Label>
        <Input
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          placeholder="receipt"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          className="italic"
          id="receipt"
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
        <div className="flex justify-between gap-2">
          <Button
            disabled={!file || mutation.isLoading}
            onClick={() => {
              const category =
                selectedCategory && (JSON.parse(selectedCategory) as Category);
              const categoryID = category ? category.id : 0;
              mutation.mutate({
                collectionID: collection.id,
                receipt: file!,
                categoryID,
              });
            }}
            className="flex gap-2 w-full bg-emerald-600 hover:bg-emerald-600/90"
          >
            <Plus size={24} />
            Add
            {mutation.isLoading && (
              <Spinner color="text-white" containerStyles="py-4" />
            )}
          </Button>
          <Button
            disabled={mutation.isLoading}
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
