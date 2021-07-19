/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCollectionTypeFieldBySlug
// ====================================================

export interface GetCollectionTypeFieldBySlug_collectionTypeFieldBySlug {
  __typename: "CollectionTypeField";
  id: string;
}

export interface GetCollectionTypeFieldBySlug {
  collectionTypeFieldBySlug: GetCollectionTypeFieldBySlug_collectionTypeFieldBySlug | null;
}

export interface GetCollectionTypeFieldBySlugVariables {
  collectionType: string;
  slug: string;
}
