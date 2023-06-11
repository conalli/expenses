"use client";

import { AddCollectionForm } from "@/components/collections/AddCollectionForm";
import { CollectionDetails } from "@/components/collections/CollectionDetails";
import { CollectionList } from "@/components/collections/CollectionList";
import { ExpenseDialog } from "@/components/expenses/ExpenseDialog";
import { Loader } from "@/components/loading/Loader";
import { useUser } from "@/hooks/useUser";
import { Category, Collection, Currency } from "@/lib/models";
import { CATEGORIES_KEY, CURRENCIES_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const getCurrencies = (token: string) => {
  return async () => {
    const res = await fetch("/api/currency/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (res.status !== 200) throw new Error("OMG");
    return (await res.json()) as Currency[];
  };
};

const getCategories = (token: string) => {
  return async () => {
    const res = await fetch("/api/category/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (res.status !== 200) throw new Error("OMG");
    return (await res.json()) as Category[];
  };
};

export default function Dashboard() {
  const { user, collections } = useUser();
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const currencies = useQuery({
    queryKey: [CURRENCIES_KEY, user.token],
    queryFn: getCurrencies(user.token),
    enabled: !!user,
  });
  const categories = useQuery({
    queryKey: [CATEGORIES_KEY, user.token],
    queryFn: getCategories(user.token),
    enabled: !!user,
  });
  useEffect(() => {
    if (!user) return;
    if (user.collections.length >= 1 && !selectedCollection) {
      setSelectedCollection(user.collections[0]);
    }
  }, [selectedCollection, user]);

  const handleSelectCollection = (collection: Collection): void => {
    setSelectedCollection(collection);
  };
  if (!user) return null;
  return (
    <main className="">
      <div className="grid grid-cols-10 grid-rows-[5%,90%]">
        <div className="col-start-1 col-span-2 row-span-2 px-8 py-4 flex flex-col gap-4 h-[calc(100vh-80px)] bg-stone-100">
          <h2 className="font-bold text-2xl">{user.username}</h2>
          <div className="py-4">
            <AddCollectionForm token={user.token} />
          </div>
          <div className="py-4">
            {collections.isLoading ? (
              <Loader />
            ) : (
              <CollectionList
                token={user.token}
                collections={user.collections}
                selectedCollection={selectedCollection}
                selectCollection={handleSelectCollection}
              />
            )}
          </div>
        </div>
        <div className="col-start-5 col-span-4 row-start-2 py-8">
          {selectedCollection && (
            <CollectionDetails
              collection={selectedCollection}
              token={user.token}
            />
          )}
        </div>
        <div className="col-start-5 col-span-4 z-10 py-8">
          {selectedCollection && currencies.data && (
            <div className="flex gap-2">
              <ExpenseDialog
                type="default"
                collection={selectedCollection}
                currencies={currencies.data}
              />
              <ExpenseDialog
                type="receipt"
                collection={selectedCollection}
                currencies={currencies.data}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
