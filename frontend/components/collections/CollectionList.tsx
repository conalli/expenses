import { Collection } from "../../lib/models";
import { CollectionListItem } from "./CollectionList/CollectionListItem";

export function CollectionList({
  collections,
  selectedCollection,
  selectCollection,
}: {
  collections?: Collection[];
  selectedCollection: Collection | null;
  selectCollection: (collection: Collection) => void;
}) {
  if (!collections) return null;
  return (
    <>
      <h3 className="font-bold text-xl text-stone-700">View Collections</h3>
      <ul className="flex flex-col justify-center gap-10 text-white">
        {collections.map((collection) => {
          const isSelected = selectedCollection?.id === collection.id;
          return (
            <CollectionListItem
              key={collection.id}
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
