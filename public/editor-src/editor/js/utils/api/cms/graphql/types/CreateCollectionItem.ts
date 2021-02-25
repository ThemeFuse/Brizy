/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { createCollectionItemInput, CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL mutation operation: CreateCollectionItem
// ====================================================

export interface CreateCollectionItem_createCollectionItem_collectionItem_type {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText";
  collectionType: CreateCollectionItem_createCollectionItem_collectionItem_fields_type_collectionType;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldMap" | "CollectionItemFieldMultiReference" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldReference" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText";
  id: string;
  values: any;
  type: CreateCollectionItem_createCollectionItem_collectionItem_fields_type;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  createdAt: string;
  /**
   * CollectionType
   */
  type: CreateCollectionItem_createCollectionItem_collectionItem_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: CreateCollectionItem_createCollectionItem_collectionItem_fields[] | null;
  /**
   * Data
   */
  template: CreateCollectionItem_createCollectionItem_collectionItem_template | null;
}

export interface CreateCollectionItem_createCollectionItem {
  __typename: "createCollectionItemPayload";
  collectionItem: CreateCollectionItem_createCollectionItem_collectionItem | null;
}

export interface CreateCollectionItem {
  /**
   * Creates a CollectionItem.
   */
  createCollectionItem: CreateCollectionItem_createCollectionItem | null;
}

export interface CreateCollectionItemVariables {
  input: createCollectionItemInput;
}
