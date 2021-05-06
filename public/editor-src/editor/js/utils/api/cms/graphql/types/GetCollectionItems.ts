/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL query operation: GetCollectionItems
// ====================================================

export interface GetCollectionItems_collectionItems_collection_type {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText";
  collectionType: GetCollectionItems_collectionItems_collection_fields_type_collectionType;
}

export interface GetCollectionItems_collectionItems_collection_fields {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldMap" | "CollectionItemFieldMultiReference" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldReference" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText";
  id: string;
  values: any;
  type: GetCollectionItems_collectionItems_collection_fields_type;
}

export interface GetCollectionItems_collectionItems_collection_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface GetCollectionItems_collectionItems_collection {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  createdAt: string;
  /**
   * CollectionType
   */
  type: GetCollectionItems_collectionItems_collection_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: GetCollectionItems_collectionItems_collection_fields[] | null;
  /**
   * Data
   */
  template: GetCollectionItems_collectionItems_collection_template | null;
}

export interface GetCollectionItems_collectionItems {
  __typename: "CollectionItemConnection";
  collection: (GetCollectionItems_collectionItems_collection | null)[] | null;
}

export interface GetCollectionItems {
  collectionItems: GetCollectionItems_collectionItems | null;
}

export interface GetCollectionItemsVariables {
  type: string;
  page?: number | null;
  itemsPerPage?: number | null;
}
