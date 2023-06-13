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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Collection, UserWithToken } from "@/lib/api/models";
import { EXPENSES_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Plus } from "lucide-react";
import { useState } from "react";
import { type ExpensePeriod } from "../CollectionDetails";

type AddReceiptData = {
  collectionID: number;
  receipt: File;
  categoryID: number;
};

const addReceipt = (token: string) => {
  return async (data: AddReceiptData) => {
    const formData = new FormData();
    formData.set("receipt", data.receipt);
    formData.set("category_id", String(data.categoryID));
    const res = await fetch(`/api/group/${data.collectionID}/receipts`, {
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
    },
    // onSuccess: () => {},
    // onError: () => {},
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="">
          <span className="flex gap-2 items-center">
            <Camera size={24} />
            Add By Receipt
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
            disabled={!file}
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
