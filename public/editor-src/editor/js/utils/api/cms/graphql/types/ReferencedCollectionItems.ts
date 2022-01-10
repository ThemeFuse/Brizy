/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL query operation: ReferencedCollectionItems
// ====================================================

export interface ReferencedCollectionItems_referencedCollectionItems_collection_type_fields {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_type {
  __typename: "CollectionType";
  id: string;
  title: string;
  slug: string;
  /**
   * fixme: must be `[CollectionTypeFieldInterface!]!`.
   */
  fields: ReferencedCollectionItems_referencedCollectionItems_collection_type_fields[] | null;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldCheck_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldCheck_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldCheck_type_collectionType;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldCheck {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldLink" | "CollectionItemFieldMap" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldVideoLink";
  id: string;
  type: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldCheck_type;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText_type_collectionType;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText_textValues {
  __typename: "CollectionItemFieldTextValues";
  value: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText {
  __typename: "CollectionItemFieldText";
  id: string;
  type: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText_type;
  textValues: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText_textValues;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_type_collectionType;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems {
  __typename: "CollectionItemReference";
  id: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues {
  __typename: "CollectionItemFieldMultiReferenceValues";
  collectionItems: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems[];
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference {
  __typename: "CollectionItemFieldMultiReference";
  id: string;
  type: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_type;
  multiReferenceValues: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference_multiReferenceValues;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_type_collectionType;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_referenceValues_collectionItem {
  __typename: "CollectionItemReference";
  id: string;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_referenceValues {
  __typename: "CollectionItemFieldReferenceValues";
  collectionItem: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_referenceValues_collectionItem;
}

export interface ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference {
  __typename: "CollectionItemFieldReference";
  id: string;
  type: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_type;
  referenceValues: ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference_referenceValues;
}

export type ReferencedCollectionItems_referencedCollectionItems_collection_fields = ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldCheck | ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldText | ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldMultiReference | ReferencedCollectionItems_referencedCollectionItems_collection_fields_CollectionItemFieldReference;

export interface ReferencedCollectionItems_referencedCollectionItems_collection {
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
  type: ReferencedCollectionItems_referencedCollectionItems_collection_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: ReferencedCollectionItems_referencedCollectionItems_collection_fields[] | null;
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
