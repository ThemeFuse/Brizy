/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionItemStatus } from "./entities";

// ====================================================
// GraphQL fragment: CollectionItemFragment
// ====================================================

export interface CollectionItemFragment_type {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CollectionItemFragment_fields_CollectionItemFieldCheck_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CollectionItemFragment_fields_CollectionItemFieldCheck_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: CollectionItemFragment_fields_CollectionItemFieldCheck_type_collectionType;
}

export interface CollectionItemFragment_fields_CollectionItemFieldCheck {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldLink" | "CollectionItemFieldMap" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText" | "CollectionItemFieldVideoLink";
  id: string;
  type: CollectionItemFragment_fields_CollectionItemFieldCheck_type;
}

export interface CollectionItemFragment_fields_CollectionItemFieldMultiReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CollectionItemFragment_fields_CollectionItemFieldMultiReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: CollectionItemFragment_fields_CollectionItemFieldMultiReference_type_collectionType;
}

export interface CollectionItemFragment_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems {
  __typename: "CollectionItemReference";
  id: string;
}

export interface CollectionItemFragment_fields_CollectionItemFieldMultiReference_multiReferenceValues {
  __typename: "CollectionItemFieldMultiReferenceValues";
  collectionItems: CollectionItemFragment_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems[];
}

export interface CollectionItemFragment_fields_CollectionItemFieldMultiReference {
  __typename: "CollectionItemFieldMultiReference";
  id: string;
  type: CollectionItemFragment_fields_CollectionItemFieldMultiReference_type;
  multiReferenceValues: CollectionItemFragment_fields_CollectionItemFieldMultiReference_multiReferenceValues;
}

export interface CollectionItemFragment_fields_CollectionItemFieldReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CollectionItemFragment_fields_CollectionItemFieldReference_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  collectionType: CollectionItemFragment_fields_CollectionItemFieldReference_type_collectionType;
}

export interface CollectionItemFragment_fields_CollectionItemFieldReference_referenceValues_collectionItem {
  __typename: "CollectionItemReference";
  id: string;
}

export interface CollectionItemFragment_fields_CollectionItemFieldReference_referenceValues {
  __typename: "CollectionItemFieldReferenceValues";
  collectionItem: CollectionItemFragment_fields_CollectionItemFieldReference_referenceValues_collectionItem;
}

export interface CollectionItemFragment_fields_CollectionItemFieldReference {
  __typename: "CollectionItemFieldReference";
  id: string;
  type: CollectionItemFragment_fields_CollectionItemFieldReference_type;
  referenceValues: CollectionItemFragment_fields_CollectionItemFieldReference_referenceValues;
}

export type CollectionItemFragment_fields = CollectionItemFragment_fields_CollectionItemFieldCheck | CollectionItemFragment_fields_CollectionItemFieldMultiReference | CollectionItemFragment_fields_CollectionItemFieldReference;

export interface CollectionItemFragment {
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
  type: CollectionItemFragment_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: CollectionItemFragment_fields[] | null;
}
