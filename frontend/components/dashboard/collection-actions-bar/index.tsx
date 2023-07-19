import {
  Category,
  Collection,
  Currency,
  UserWithToken,
} from "@/lib/api/models";
import { ExpensePeriod } from "../collection-details";
import { AddExpenseDialog } from "../dialog/add-expense";
import { AddReceiptDialog } from "../dialog/add-receipt";
import { CollectionHeader } from "./collection-header";

type CollectionActionsBarProps = {
  user: UserWithToken;
  selectedCollection: Collection;
  categories: Category[];
  currencies: Currency[];
  expensePeriod: ExpensePeriod;
};

export default function CollectionActionsBar({
  user,
  selectedCollection,
  categories,
  currencies,
  expensePeriod,
}: CollectionActionsBarProps) {
  return (
    <div className="flex gap-2 items-center py-4 px-8 bg-stone-50 border-b-2">
      <CollectionHeader
        collectionName={selectedCollection.name}
        createdAt={selectedCollection.created_at}
      />
      <span className="text-stone-700/20 px-4">|</span>
      <h2 className="text-lg text-stone-700 font-bold pr-4">Actions:</h2>
      <AddExpenseDialog
        user={user}
        expensePeriod={expensePeriod}
        collection={selectedCollection}
        categories={categories}
        currencies={currencies}
      />
      <AddReceiptDialog
        user={user}
        expensePeriod={expensePeriod}
        collection={selectedCollection}
        categories={categories}
      />
    </div>
  );
}
