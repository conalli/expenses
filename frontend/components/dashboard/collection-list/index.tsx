import { Collection } from "@/lib/api/models";
import { CollectionListItem } from "./collection-list-item";

export function CollectionList({
  token,
  collections,
  selectedCollection,
  selectCollection,
}: {
  token: string;
  collections?: Collection[];
  selectedCollection: Collection | null;
  selectCollection: (collection: Collection) => void;
}) {
  if (!collections) return null;
  return (
    <>
      <h3 className="font-bold text-xl text-stone-700 py-4">
        View Collections
      </h3>
      <ul className="flex flex-col justify-center gap-2">
        {collections.map((collection) => {
          const isSelected = selectedCollection?.id === collection.id;
          return (
            <CollectionListItem
              key={collection.id}
              token={token}
              collection={collection}
              isSelected={isSelected}
              selectCollection={selectCollection}
            />
          );
        })}
      </ul>
    </>
  );
}
