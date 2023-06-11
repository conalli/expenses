import { Collection, Currency } from "@/lib/models";
import { Camera, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "./DatePicker";

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

export function ExpenseDialog({
  type,
  collection,
  currencies,
}: {
  type: "default" | "receipt";
  collection: Collection;
  currencies: Currency[];
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {type === "default" ? (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <span className="flex gap-2 items-center">
              <Plus size={24} />
              Add Expense
            </span>
          </Button>
        ) : (
          <Button className="">
            <span className="flex gap-2 items-center">
              <Camera size={24} />
              Add By Receipt
            </span>
          </Button>
        )}
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
          <Button className="flex gap-2 w-full bg-emerald-600 hover:bg-emerald-700">
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
