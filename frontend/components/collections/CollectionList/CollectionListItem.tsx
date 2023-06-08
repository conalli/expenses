import { Collection } from "@/lib/models";
import { CollectionMembersList } from "./CollectionMembersList";
import { DeleteCollectionDialog } from "./DeleteCollectionDialog";

export function CollectionListItem({
  collection,
  isSelected,
  selectCollection,
}: {
  collection: Collection;
  isSelected: boolean;
  selectCollection: (collection: Collection) => void;
}) {
  return (
    <li
      className={isSelected ? "text-emerald-600 font-semibold" : "text-black"}
    >
      <div className="flex justify-between">
        <button onClick={() => selectCollection(collection)}>
          {collection.name}
        </button>
        <DeleteCollectionDialog
          collection={collection}
          isSelected={isSelected}
        />
      </div>
      <CollectionMembersList members={collection.members} />
    </li>
  );
}
