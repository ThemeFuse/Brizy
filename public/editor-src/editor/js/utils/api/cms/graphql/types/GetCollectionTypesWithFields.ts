/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionFieldTypeName } from "./entities";

// ====================================================
// GraphQL query operation: GetCollectionTypesWithFields
// ====================================================

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldCheck {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldMap" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText";
  id: string;
  type: CollectionFieldTypeName;
}

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings_collectionType {
  __typename: "CollectionTypeReference";
  id: string;
  title: string;
}

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings {
  __typename: "CollectionTypeFieldReferenceSettings";
  collectionType: GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings_collectionType;
}

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldReference {
  __typename: "CollectionTypeFieldReference";
  id: string;
  type: CollectionFieldTypeName;
  referenceSettings: GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings;
}

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings_collectionType {
  __typename: "CollectionTypeReference";
  id: string;
  title: string;
}

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings {
  __typename: "CollectionTypeFieldMultiReferenceSettings";
  collectionType: GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings_collectionType;
}

export interface GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldMultiReference {
  __typename: "CollectionTypeFieldMultiReference";
  id: string;
  type: CollectionFieldTypeName;
  multiReferenceSettings: GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings;
}

export type GetCollectionTypesWithFields_collectionTypes_fields = GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldCheck | GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldReference | GetCollectionTypesWithFields_collectionTypes_fields_CollectionTypeFieldMultiReference;

export interface GetCollectionTypesWithFields_collectionTypes {
  __typename: "CollectionType";
  id: string;
  slug: string | null;
  title: string;
  /**
   * fixme: must be `[CollectionTypeFieldInterface!]!`.
   */
  fields: GetCollectionTypesWithFields_collectionTypes_fields[] | null;
}

export interface GetCollectionTypesWithFields {
  collectionTypes: (GetCollectionTypesWithFields_collectionTypes | null)[] | null;
}
