/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { updateCollectionItemInput, CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL mutation operation: UpdateCollectionItem
// ====================================================

export interface UpdateCollectionItem_updateCollectionItem_collectionItem_type {
  __typename: "CollectionType";
  id: string;
}

export interface UpdateCollectionItem_updateCollectionItem_collectionItem {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  createdAt: string;
  pageData: string | null;
  /**
   * CollectionType
   */
  type: UpdateCollectionItem_updateCollectionItem_collectionItem_type;
}

export interface UpdateCollectionItem_updateCollectionItem {
  __typename: "updateCollectionItemPayload";
  collectionItem: UpdateCollectionItem_updateCollectionItem_collectionItem | null;
}

export interface UpdateCollectionItem {
  /**
   * Updates a CollectionItem.
   */
  updateCollectionItem: UpdateCollectionItem_updateCollectionItem | null;
}

export interface UpdateCollectionItemVariables {
  input: updateCollectionItemInput;
}
