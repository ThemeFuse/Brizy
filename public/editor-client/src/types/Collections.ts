export interface CollectionExtra {
  collectionId: string;
  search: string;
}

export interface CollectionType {
  name: string;
  label: string;
  orderBy: { field: string; label: string }[];
}
