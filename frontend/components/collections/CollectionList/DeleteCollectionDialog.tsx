"use client";

import { Collection } from "@/lib/models";
import { X } from "lucide-react";
import { useState } from "react";
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

export function DeleteCollectionDialog({
  collection,
  isSelected,
}: {
  collection: Collection;
  isSelected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const deleteCollectionText = `delete ${collection.name}`;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={isSelected ? "text-red-600 inline-block" : " hidden "}
      >
        <X size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete your
            <strong> Collection </strong> for all members.
          </DialogDescription>
          <DialogDescription>
            To delete{" "}
            <strong>
              <i>{collection.name}</i>
            </strong>
            , type &quot;
            <i>{deleteCollectionText}</i>&quot; in the box below.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder={`delete ${collection.name}`}
          value={deleteText}
          onChange={(e) => setDeleteText(e.target.value)}
          className="italic"
        />
        <div className="flex justify-between gap-2">
          <Button
            variant="destructive"
            className="w-full"
            disabled={deleteCollectionText !== deleteText}
            onClick={() =>
              console.log("FFF", deleteText !== deleteCollectionText)
            }
          >
            Delete
          </Button>
          <Button onClick={() => setOpen(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
