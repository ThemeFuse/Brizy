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

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type_collectionType;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldCheck {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldLink" | "CollectionItemFieldMap" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText" | "CollectionItemFieldVideoLink";
  id: string;
  type: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type_collectionType;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems {
  __typename: "CollectionItemReference";
  id: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues {
  __typename: "CollectionItemFieldMultiReferenceValues";
  collectionItems: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems[];
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference {
  __typename: "CollectionItemFieldMultiReference";
  id: string;
  type: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type;
  multiReferenceValues: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_type_collectionType;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues_collectionItem {
  __typename: "CollectionItemReference";
  id: string;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues {
  __typename: "CollectionItemFieldReferenceValues";
  collectionItem: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues_collectionItem;
}

export interface CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference {
  __typename: "CollectionItemFieldReference";
  id: string;
  type: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_type;
  referenceValues: CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues;
}

export type CreateCollectionItem_createCollectionItem_collectionItem_fields = CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldCheck | CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference | CreateCollectionItem_createCollectionItem_collectionItem_fields_CollectionItemFieldReference;

export interface CreateCollectionItem_createCollectionItem_collectionItem {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  pageData: string | null;
  createdAt: string;
  /**
   * CollectionType
   */
  type: CreateCollectionItem_createCollectionItem_collectionItem_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: CreateCollectionItem_createCollectionItem_collectionItem_fields[] | null;
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
  withFields?: boolean | null;
}
