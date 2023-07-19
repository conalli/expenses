"use client";

import { AddCollectionForm } from "@/components/dashboard/add-collection-form";
import CollectionActionsBar from "@/components/dashboard/collection-actions-bar";
import {
  CollectionDetails,
  ExpensePeriod,
} from "@/components/dashboard/collection-details";
import { CollectionList } from "@/components/dashboard/collection-list";
import { Spinner } from "@/components/ui/loading/spinner";
import { useCategory } from "@/hooks/use-category";
import { useCurrency } from "@/hooks/use-currency";
import { useUser } from "@/hooks/use-user";
import { Collection } from "@/lib/api/models";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, collections } = useUser();

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [expensePeriod, setExpensePeriod] = useState<ExpensePeriod>("month");
  const handlePeriodChange = (period: ExpensePeriod) => {
    setExpensePeriod(period);
  };

  useEffect(() => {
    if (user && user.collections.length >= 1) {
      return setSelectedCollection(user.collections[0]);
    }
  }, [user]);

  const currencies = useCurrency(user);

  const categories = useCategory(user);

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
            <CollectionActionsBar
              user={user}
              selectedCollection={selectedCollection}
              categories={categories.data}
              currencies={currencies.data}
              expensePeriod={expensePeriod}
            />
          )}
        </div>
        <div className="row-start-2 col-start-4 col-span-6 pt-4 pb-8">
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
