/* eslint-disable @typescript-eslint/no-use-before-define */
import { GetCollectionTypesWithFields_collectionTypes as CollectionTypesWithFields } from "./graphql/types/GetCollectionTypesWithFields";
import { GetCollectionItem_collectionItem as CollectionItem } from "./graphql/types/GetCollectionItem";

const collectionTypesBlacklist = ["story", "popup"];

export const correctCollectionTypesWithFields = (
  collections: CollectionTypesWithFields[]
): CollectionTypesWithFields[] =>
  collections.filter(
    collection =>
      !!collection.slug && !collectionTypesBlacklist.includes(collection.slug)
  );

type Status = "draft" | "published" | "all";

export const correctCollectionItems = ({
  include,
  search,
  status = "published"
}: {
  include?: string[];
  search?: string;
  status?: Status;
}) => (items: CollectionItem[]): CollectionItem[] =>
  filterByStatus(items, status).filter(
    item =>
      (include ? include.includes(item.id) : true) &&
      (search ? item.title.toLowerCase().includes(search.toLowerCase()) : true)
  );

function filterByStatus(
  items: CollectionItem[],
  status: Status
): CollectionItem[] {
  return items.filter(item => status === "all" || item.status === status);
}
