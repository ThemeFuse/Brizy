/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL query operation: GetCollectionItems
// ====================================================

export interface GetCollectionItems_collectionItems_collection_type_fields {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
}

export interface GetCollectionItems_collectionItems_collection_type {
  __typename: "CollectionType";
  id: string;
  title: string;
  slug: string;
  /**
   * fixme: must be `[CollectionTypeFieldInterface!]!`.
   */
  fields: GetCollectionItems_collectionItems_collection_type_fields[] | null;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldCheck_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldCheck_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldCheck_type_collectionType;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldCheck {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldLink" | "CollectionItemFieldMap" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldVideoLink";
  id: string;
  type: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldCheck_type;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText_type_collectionType;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText_textValues {
  __typename: "CollectionItemFieldTextValues";
  value: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText {
  __typename: "CollectionItemFieldText";
  id: string;
  type: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText_type;
  textValues: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText_textValues;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_type_collectionType;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems {
  __typename: "CollectionItemReference";
  id: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues {
  __typename: "CollectionItemFieldMultiReferenceValues";
  collectionItems: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems[];
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference {
  __typename: "CollectionItemFieldMultiReference";
  id: string;
  type: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_type;
  multiReferenceValues: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_type_collectionType;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_referenceValues_collectionItem {
  __typename: "CollectionItemReference";
  id: string;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_referenceValues {
  __typename: "CollectionItemFieldReferenceValues";
  collectionItem: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_referenceValues_collectionItem;
}

export interface GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference {
  __typename: "CollectionItemFieldReference";
  id: string;
  type: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_type;
  referenceValues: GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference_referenceValues;
}

export type GetCollectionItems_collectionItems_collection_fields = GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldCheck | GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldText | GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldMultiReference | GetCollectionItems_collectionItems_collection_fields_CollectionItemFieldReference;

export interface GetCollectionItems_collectionItems_collection {
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
  type: GetCollectionItems_collectionItems_collection_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: GetCollectionItems_collectionItems_collection_fields[] | null;
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
  withFields?: boolean | null;
}
