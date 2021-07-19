/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL query operation: ReferencedCollectionItems
// ====================================================

export interface ReferencedCollectionItems_referencedCollectionItems_collection_type {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: ReferencedCollectionItems_referencedCollectionItems_collection_fields_type_collectionType;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldLink" | "CollectionItemFieldMap" | "CollectionItemFieldMultiReference" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldReference" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText" | "CollectionItemFieldVideoLink";
  id: string;
  values: any;
  type: ReferencedCollectionItems_referencedCollectionItems_collection_fields_type;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  createdAt: string;
  /**
   * CollectionType
   */
  type: ReferencedCollectionItems_referencedCollectionItems_collection_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: ReferencedCollectionItems_referencedCollectionItems_collection_fields[] | null;
  /**
   * Data
   */
  template: ReferencedCollectionItems_referencedCollectionItems_collection_template | null;
}

export interface ReferencedCollectionItems_referencedCollectionItems {
  __typename: "CollectionItemConnection";
  collection: (ReferencedCollectionItems_referencedCollectionItems_collection | null)[] | null;
}

export interface ReferencedCollectionItems {
  referencedCollectionItems: ReferencedCollectionItems_referencedCollectionItems | null;
}

export interface ReferencedCollectionItemsVariables {
  type: string;
  page?: number | null;
  itemsPerPage?: number | null;
  withFields?: boolean | null;
}
