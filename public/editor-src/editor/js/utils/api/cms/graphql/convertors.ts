export const graphQLIdPrefixes = {
  project: "/data/",
  collectionType: "/collection_types/",
  collectionTypeField: "/collection_type_fields/",
  collectionItem: "/collection_items/",
  collectionItemField: "/collection_item_fields/",
  template: "/templates/"
};

export const projectAddPrefix = (id: number): string =>
  `${graphQLIdPrefixes.project}${id}`;
export const projectTrimPrefix = (id: string): number =>
  Number(id.replace(graphQLIdPrefixes.project, ""));

export const collectionTypeAddPrefix = (id: number): string =>
  `${graphQLIdPrefixes.collectionType}${id}`;
export const collectionTypeTrimPrefix = (id: string): number =>
  Number(id.replace(graphQLIdPrefixes.collectionType, ""));

export const collectionTypeFieldAddPrefix = (id: number): string =>
  `${graphQLIdPrefixes.collectionTypeField}${id}`;
export const collectionTypeFieldTrimPrefix = (id: string): number =>
  Number(id.replace(graphQLIdPrefixes.collectionTypeField, ""));

export const collectionItemAddPrefix = (id: number): string =>
  `${graphQLIdPrefixes.collectionItem}${id}`;
export const collectionItemTrimPrefix = (id: string): number =>
  Number(id.replace(graphQLIdPrefixes.collectionItem, ""));

export const collectionItemFieldAddPrefix = (id: number): string =>
  `${graphQLIdPrefixes.collectionItemField}${id}`;
export const collectionItemFieldTrimPrefix = (id: string): number =>
  Number(id.replace(graphQLIdPrefixes.collectionItemField, ""));

export const templateAddPrefix = (id: number): string =>
  `${graphQLIdPrefixes.template}${id}`;
export const templateTrimPrefix = (id: string): number =>
  Number(id.replace(graphQLIdPrefixes.template, ""));
