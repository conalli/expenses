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
import { useToast } from "@/components/ui/use-toast";
import { Collection } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const addMemberToCollection = (token: string, collectionID: number) => {
  return async (username: string) => {
    const res = await fetch(apiURL(`/group/${collectionID}/members/`), {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    if (res.status >= 400 && res.status < 500) {
      const response = (await res.json()) as {
        result: string;
        description: string;
      };
      throw new Error(response.description);
    }
    if (res.status >= 500) {
      throw new Error("Something has gone wrong");
    }
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
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addMemberToCollection(token, collection.id),
    onMutate: async () => {
      await queryClient.cancelQueries([COLLECTIONS_KEY, token]);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([COLLECTIONS_KEY, token]);
    },
    onError: async (err) => {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "could not add user to collection, please check the username is correct",
      });
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
            ? "text-emerald-500 hover:text-emerald-500/90 rounded inline-block"
            : "invisible"
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
            className="w-full flex gap-4 bg-emerald-600 hover:bg-emerald-600/90"
            disabled={memberUsername.length < 3 || mutation.isLoading}
            onClick={() => mutation.mutate(memberUsername)}
          >
            Invite
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
