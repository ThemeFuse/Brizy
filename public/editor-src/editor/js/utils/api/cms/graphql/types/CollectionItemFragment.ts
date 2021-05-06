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

export interface CollectionItemFragment_fields_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

export interface CollectionItemFragment_fields_type {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldMap" | "CollectionTypeFieldMultiReference" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldReference" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText";
  collectionType: CollectionItemFragment_fields_type_collectionType;
}

export interface CollectionItemFragment_fields {
  __typename: "CollectionItemFieldCheck" | "CollectionItemFieldColor" | "CollectionItemFieldDateTime" | "CollectionItemFieldEmail" | "CollectionItemFieldFile" | "CollectionItemFieldGallery" | "CollectionItemFieldImage" | "CollectionItemFieldMap" | "CollectionItemFieldMultiReference" | "CollectionItemFieldNumber" | "CollectionItemFieldPassword" | "CollectionItemFieldPhone" | "CollectionItemFieldReference" | "CollectionItemFieldRichText" | "CollectionItemFieldSelect" | "CollectionItemFieldSwitch" | "CollectionItemFieldText";
  id: string;
  values: any;
  type: CollectionItemFragment_fields_type;
}

export interface CollectionItemFragment_template {
  __typename: "Template";
  id: string;
  data: string | null;
}

export interface CollectionItemFragment {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  createdAt: string;
  /**
   * CollectionType
   */
  type: CollectionItemFragment_type;
  /**
   * fixme: must be `[CollectionItemFieldInterface!]!`
   */
  fields: CollectionItemFragment_fields[] | null;
  /**
   * Data
   */
  template: CollectionItemFragment_template | null;
}
