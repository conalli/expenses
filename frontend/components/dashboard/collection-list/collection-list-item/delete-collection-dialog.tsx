"use client";

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
import { Spinner } from "@/components/ui/loading/spinner";
import { Collection } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";

const deleteCollection = (token: string) => {
  return async (id: number) => {
    const res = await fetch(apiURL(`/group/${id}/`), {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return (await res.json()) as { result: string; deleted: number };
  };
};

export function DeleteCollectionDialog({
  token,
  collection,
  isSelected,
}: {
  token: string;
  collection: Collection;
  isSelected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const deleteCollectionText = `delete ${collection.name}`;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCollection(token),
    onMutate: async () => {
      await queryClient.cancelQueries([COLLECTIONS_KEY, token]);
    },
    onSettled: () => {
      queryClient.invalidateQueries([COLLECTIONS_KEY, token]);
    },
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          isSelected
            ? "bg-red-500 hover:bg-red-600 rounded text-white inline-block"
            : "invisible"
        }
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
            className="w-full flex gap-4"
            disabled={deleteCollectionText !== deleteText || mutation.isLoading}
            onClick={() => mutation.mutate(collection.id)}
          >
            Delete
            {mutation.isLoading && (
              <Spinner color="text-white" containerStyles="py-4" />
            )}
          </Button>
          <Button onClick={() => setOpen(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
