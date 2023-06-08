"use client";

import { AddCollectionForm } from "@/components/collections/AddCollectionForm";
import { CollectionDetails } from "@/components/collections/CollectionDetails";
import { CollectionList } from "@/components/collections/CollectionList";
import { useUser } from "@/hooks/useUser";
import { Collection } from "@/lib/models";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

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
      <div className="grid grid-cols-5">
        <div className="col-start-1 px-8 py-4 flex flex-col gap-4 h-screen bg-stone-100">
          <h2 className="font-bold text-2xl">{user.username}</h2>
          <div className="py-4">
            <AddCollectionForm token={user.token} />
          </div>
          <div className="py-4">
            <CollectionList
              collections={user.collections}
              selectedCollection={selectedCollection}
              selectCollection={handleSelectCollection}
            />
          </div>
        </div>
        <div className="col-start-3 col-span-2 p-8">
          {selectedCollection && (
            <CollectionDetails
              collection={selectedCollection}
              token={user.token}
            />
          )}
        </div>
      </div>
    </main>
  );
}
