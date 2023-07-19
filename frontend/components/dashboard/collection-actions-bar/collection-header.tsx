type CollectionHeaderProps = {
  collectionName: string;
  createdAt: string;
};

const createdDate = (createdDate: string): string => {
  const sinceDate = new Date(createdDate);
  return new Intl.DateTimeFormat("ja-JP").format(sinceDate);
};

export function CollectionHeader({
  collectionName,
  createdAt,
}: CollectionHeaderProps) {
  const created = createdDate(createdAt);
  return (
    <div className="flex flex-col">
      <h2 className="text-lg text-stone-700 font-bold">
        {collectionName.toUpperCase()}
      </h2>
      <p className="text-sm text-stone-700/50">created: {created}</p>
    </div>
  );
}
