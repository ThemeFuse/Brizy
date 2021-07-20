/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCollectionItemFieldBySlug
// ====================================================

export interface GetCollectionItemFieldBySlug_collectionItemFieldBySlug_type {
  __typename: "CollectionTypeField";
  id: string;
  slug: string | null;
}

export interface GetCollectionItemFieldBySlug_collectionItemFieldBySlug {
  __typename: "CollectionItemField";
  id: string;
  values: any;
  type: GetCollectionItemFieldBySlug_collectionItemFieldBySlug_type;
}

export interface GetCollectionItemFieldBySlug {
  collectionItemFieldBySlug: GetCollectionItemFieldBySlug_collectionItemFieldBySlug | null;
}

export interface GetCollectionItemFieldBySlugVariables {
  item: string;
  slug: string;
}
