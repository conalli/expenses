"use client";

import { AddCollectionForm } from "@/components/dashboard/add-collection-form";
import {
  CollectionDetails,
  ExpensePeriod,
} from "@/components/dashboard/collection-details";
import { CollectionList } from "@/components/dashboard/collection-list";
import { AddExpenseDialog } from "@/components/dashboard/expense-dialog";
import { AddReceiptDialog } from "@/components/dashboard/receipt-dialog";
import { Spinner } from "@/components/ui/loading/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/use-user";
import { Category, Collection, Currency } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { CATEGORIES_KEY, CURRENCIES_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const getCurrencies = (token?: string) => {
  return async () => {
    const res = await fetch(apiURL("/currency/"), {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (res.status !== 200) throw new Error("OMG");
    return (await res.json()) as Currency[];
  };
};

const getCategories = (token?: string) => {
  return async () => {
    const res = await fetch(apiURL("/category/"), {
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
  const [expensePeriod, setExpensePeriod] = useState<ExpensePeriod>("month");
  const { toast } = useToast();
  const handlePeriodChange = (period: ExpensePeriod) => {
    setExpensePeriod(period);
  };

  useEffect(() => {
    if (user && user.collections.length >= 1) {
      return setSelectedCollection(user.collections[0]);
    }
  }, [user]);

  const currencies = useQuery({
    queryKey: [CURRENCIES_KEY, user?.token],
    queryFn: getCurrencies(user?.token),
    enabled: !!user,
    onError: (_err) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "could not get expense currencies",
      });
    },
  });

  const categories = useQuery({
    queryKey: [CATEGORIES_KEY, user?.token],
    queryFn: getCategories(user?.token),
    enabled: !!user,
    onError: (_err) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "could not get collection categories",
      });
    },
  });

  const handleSelectCollection = (collection: Collection): void => {
    setSelectedCollection(collection);
  };
  if (!user) return null;
  return (
    <main className="">
      <div className="grid grid-cols-10 grid-rows-[1fr,9fr]">
        <div className="min-h-[max(calc(100vh-80px),100%)] col-start-1 col-span-2 row-start-1 row-span-2 px-8 py-4 flex flex-col gap-4 bg-stone-100 border-r-2">
          <h2 className="font-bold text-2xl">{user.username}</h2>
          <div className="py-4">
            <AddCollectionForm token={user.token} />
          </div>
          <div className="py-4">
            {collections.isLoading ? (
              <Spinner />
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
        <div className="row-start-1 row-span-1 col-start-3 col-span-8">
          {selectedCollection && categories.data && currencies.data && (
            <div className="flex gap-2 items-center py-4 px-8 bg-stone-50 border-b-2">
              <h2 className="text-xl text-stone-700 font-bold">
                {selectedCollection.name.toUpperCase()}
              </h2>
              <span className="text-stone-700/20 px-4">|</span>
              <h2 className="text-xl text-stone-700 font-bold pr-4">
                Actions:
              </h2>
              <AddExpenseDialog
                user={user}
                expensePeriod={expensePeriod}
                collection={selectedCollection}
                categories={categories.data}
                currencies={currencies.data}
              />
              <AddReceiptDialog
                user={user}
                expensePeriod={expensePeriod}
                collection={selectedCollection}
                categories={categories.data}
              />
            </div>
          )}
        </div>
        <div className="row-start-2 col-start-5 col-span-4 pb-8">
          {selectedCollection && (
            <CollectionDetails
              collection={selectedCollection}
              user={user}
              expensePeriod={expensePeriod}
              setExpensePeriod={handlePeriodChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}
