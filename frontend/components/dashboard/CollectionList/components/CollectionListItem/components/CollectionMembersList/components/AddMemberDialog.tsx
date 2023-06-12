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
import { Collection } from "@/lib/api/models";
import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const addMemberToCollection = (token: string, collectionID: number) => {
  return async (username: string) => {
    const res = await fetch(`/api/group/${collectionID}/members`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    if (res.status >= 300) throw new Error("OMG");
    return (await res.json()) as { result: string };
  };
};

export function AddMemberDialog({
  token,
  collection,
  isSelected,
}: {
  token: string;
  collection: Collection;
  isSelected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addMemberToCollection(token, collection.id),
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
            ? "text-emerald-600 hover:text-emerald-500 rounded  inline-block"
            : " hidden "
        }
      >
        <PlusCircle size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            Add new member to {collection.name}?
          </DialogTitle>
          <DialogDescription>
            This will invite them to join your
            <strong> Collection </strong>.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="member username"
          type="text"
          value={memberUsername}
          onChange={(e) => setMemberUsername(e.target.value)}
          className="italic"
        />
        <div className="flex justify-between gap-2">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={memberUsername.length > 3}
            onClick={() => mutation.mutate(memberUsername)}
          >
            Invite
          </Button>
          <Button onClick={() => setOpen(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
