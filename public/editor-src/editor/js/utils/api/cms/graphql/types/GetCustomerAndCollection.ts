/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CollectionFieldTypeName } from "./entities";

// ====================================================
// GraphQL query operation: GetCustomerAndCollection
// ====================================================

export interface GetCustomerAndCollection_customers_collection {
  __typename: "Customer";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface GetCustomerAndCollection_customers {
  __typename: "CustomerConnection";
  collection: (GetCustomerAndCollection_customers_collection | null)[] | null;
}

export interface GetCustomerAndCollection_customerGroups_collection {
  __typename: "CustomerGroup";
  id: string;
  name: string | null;
}

export interface GetCustomerAndCollection_customerGroups {
  __typename: "CustomerGroupConnection";
  collection: (GetCustomerAndCollection_customerGroups_collection | null)[] | null;
}

export interface GetCustomerAndCollection_collectionTypes_settings {
  __typename: "CollectionTypeSettings";
  hidden: boolean;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldCheck {
  __typename: "CollectionTypeFieldCheck" | "CollectionTypeFieldColor" | "CollectionTypeFieldDateTime" | "CollectionTypeFieldEmail" | "CollectionTypeFieldFile" | "CollectionTypeFieldGallery" | "CollectionTypeFieldImage" | "CollectionTypeFieldLink" | "CollectionTypeFieldMap" | "CollectionTypeFieldNumber" | "CollectionTypeFieldPassword" | "CollectionTypeFieldPhone" | "CollectionTypeFieldRichText" | "CollectionTypeFieldSelect" | "CollectionTypeFieldSwitch" | "CollectionTypeFieldText" | "CollectionTypeFieldVideoLink";
  id: string;
  type: CollectionFieldTypeName;
  label: string;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings_collectionType {
  __typename: "CollectionTypeReference";
  id: string;
  title: string;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings {
  __typename: "CollectionTypeFieldReferenceSettings";
  collectionType: GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings_collectionType;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldReference {
  __typename: "CollectionTypeFieldReference";
  id: string;
  type: CollectionFieldTypeName;
  label: string;
  referenceSettings: GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldReference_referenceSettings;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings_collectionType {
  __typename: "CollectionTypeReference";
  id: string;
  title: string;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings {
  __typename: "CollectionTypeFieldMultiReferenceSettings";
  collectionType: GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings_collectionType;
}

export interface GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldMultiReference {
  __typename: "CollectionTypeFieldMultiReference";
  id: string;
  type: CollectionFieldTypeName;
  label: string;
  multiReferenceSettings: GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldMultiReference_multiReferenceSettings;
}

export type GetCustomerAndCollection_collectionTypes_fields = GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldCheck | GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldReference | GetCustomerAndCollection_collectionTypes_fields_CollectionTypeFieldMultiReference;

export interface GetCustomerAndCollection_collectionTypes {
  __typename: "CollectionType";
  id: string;
  slug: string;
  title: string;
  settings: GetCustomerAndCollection_collectionTypes_settings;
  /**
   * fixme: must be `[CollectionTypeFieldInterface!]!`.
   */
  fields: GetCustomerAndCollection_collectionTypes_fields[] | null;
}

export interface GetCustomerAndCollection {
  customers: GetCustomerAndCollection_customers | null;
  customerGroups: GetCustomerAndCollection_customerGroups | null;
  collectionTypes: (GetCustomerAndCollection_collectionTypes | null)[] | null;
}

export interface GetCustomerAndCollectionVariables {
  page?: number | null;
  itemsPerPage?: number | null;
}
