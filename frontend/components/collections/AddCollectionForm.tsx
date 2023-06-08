"use client";

import { AddCollectionResponse } from "@/lib/api-response";
import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const schema = z.object({
  name: z.string().min(3, {
    message: "Collection name must be more than 3 characters.",
  }),
});

type AddCollectionData = {
  name: string;
};

const addUserCollection = (token: string) => {
  return async (data: AddCollectionData): Promise<AddCollectionResponse> => {
    console.log("TKN", token);
    const res = await fetch("/api/group/", {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: JSON.stringify(data),
    });
    if (res.status >= 300) throw new Error("OMG NO GROUPS");
    return (await res.json()) as AddCollectionResponse;
  };
};

export function AddCollectionForm({ token }: { token: string }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });
  const queryClient = useQueryClient();
  const collections = useMutation({
    mutationFn: addUserCollection(token),
    onMutate: async () => {
      await queryClient.cancelQueries([COLLECTIONS_KEY, token]);
    },
    onSettled: () => {
      queryClient.invalidateQueries([COLLECTIONS_KEY, token]);
    },
    onSuccess: () => {
      form.reset();
    },
    onError: () => {
      form.reset();
    },
  });

  const submitForm = (data: AddCollectionData) => {
    collections.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-xl text-stone-700">
                Add Collection
              </FormLabel>
              <FormControl>
                <Input
                  disabled={collections.isLoading}
                  placeholder="name"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={collections.isLoading}
          className="bg-emerald-600"
        >
          Add +
        </Button>
      </form>
    </Form>
  );
}
