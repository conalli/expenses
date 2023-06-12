import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collection } from "@/lib/api/models";
import { CollectionMembersList } from "./components/CollectionMembersList";
import { DeleteCollectionDialog } from "./components/DeleteCollectionDialog";

export function CollectionListItem({
  token,
  collection,
  isSelected,
  selectCollection,
}: {
  token: string;
  collection: Collection;
  isSelected: boolean;
  selectCollection: (collection: Collection) => void;
}) {
  return (
    <li
      className={isSelected ? "text-emerald-600 font-semibold" : "text-black"}
    >
      <Card
        className={isSelected ? "bg-emerald-50" : "hover:cursor-pointer"}
        onClick={() => selectCollection(collection)}
      >
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <h5>{collection.name}</h5>
              <DeleteCollectionDialog
                token={token}
                collection={collection}
                isSelected={isSelected}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-normal">members:</p>
          <CollectionMembersList
            token={token}
            collection={collection}
            isSelected={isSelected}
          />
        </CardContent>
      </Card>
    </li>
  );
}
