import { Spinner } from "@/components/ui/loading/spinner";
import { Collection, UserWithToken } from "@/lib/api/models";
import { AddCollectionForm } from "./add-collection-form";
import { CollectionListItem } from "./collection-list-item";

export function CollectionList({
  user,
  collections,
  collectionIsLoading,
  selectedCollection,
  selectCollection,
}: {
  user: UserWithToken;
  collections?: Collection[];
  collectionIsLoading: boolean;
  selectedCollection: Collection | null;
  selectCollection: (collection: Collection) => void;
}) {
  if (!collections) return null;
  return (
    <>
      <h2 className="font-bold text-2xl">{user.username}</h2>
      <div className="py-4">
        <AddCollectionForm token={user.token} />
      </div>
      <div className="py-4">
        {collectionIsLoading ? (
          <Spinner />
        ) : (
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
                    token={user.token}
                    collection={collection}
                    isSelected={isSelected}
                    selectCollection={selectCollection}
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
