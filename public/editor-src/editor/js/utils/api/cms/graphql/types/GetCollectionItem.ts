/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL query operation: GetCollectionItem
// ====================================================

export interface GetCollectionItem_collectionItem_type {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItem_collectionItem_fields_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItem_collectionItem_fields_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText";
  collectionType: GetCollectionItem_collectionItem_fields_type_collectionType;
}

export interface GetCollectionItem_collectionItem_fields {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldMap" | "CollectionItemFieldMultiReference" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldReference" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText";
  id: string;
  values: any;
  type: GetCollectionItem_collectionItem_fields_type;
}

export interface GetCollectionItem_collectionItem_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface GetCollectionItem_collectionItem {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  createdAt: string;
  /**
   * CollectionType
   */
  type: GetCollectionItem_collectionItem_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: GetCollectionItem_collectionItem_fields[] | null;
  /**
   * Data
   */
  template: GetCollectionItem_collectionItem_template | null;
}

export interface GetCollectionItem {
  collectionItem: GetCollectionItem_collectionItem | null;
}

export interface GetCollectionItemVariables {
  id: string;
}
