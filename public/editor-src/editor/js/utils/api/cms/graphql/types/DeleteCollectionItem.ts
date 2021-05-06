/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { deleteCollectionItemInput } from "./entities";

// ====================================================
// GraphQL mutation operation: DeleteCollectionItem
// ====================================================

export interface DeleteCollectionItem_deleteCollectionItem_collectionItem {
  __typename: "CollectionItem";
  id: string;
}

export interface DeleteCollectionItem_deleteCollectionItem {
  __typename: "deleteCollectionItemPayload";
  collectionItem: DeleteCollectionItem_deleteCollectionItem_collectionItem | null;
}

export interface DeleteCollectionItem {
  /**
   * Deletes a CollectionItem.
   */
  deleteCollectionItem: DeleteCollectionItem_deleteCollectionItem | null;
}

export interface DeleteCollectionItemVariables {
  input: deleteCollectionItemInput;
}
