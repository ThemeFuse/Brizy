enum CollectionItemStatus {
  draft = "draft",
  published = "published"
}

interface GetCollectionItem_collectionItem_type_fields {
  __typename:
    | "CollectionTypeFieldCheck"
    | "CollectionTypeFieldColor"
    | "CollectionTypeFieldDateTime"
    | "CollectionTypeFieldEmail"
    | "CollectionTypeFieldFile"
    | "CollectionTypeFieldGallery"
    | "CollectionTypeFieldImage"
    | "CollectionTypeFieldLink"
    | "CollectionTypeFieldMap"
    | "CollectionTypeFieldMultiReference"
    | "CollectionTypeFieldNumber"
    | "CollectionTypeFieldPassword"
    | "CollectionTypeFieldPhone"
    | "CollectionTypeFieldReference"
    | "CollectionTypeFieldRichText"
    | "CollectionTypeFieldSelect"
    | "CollectionTypeFieldSwitch"
    | "CollectionTypeFieldText"
    | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
}

interface GetCollectionItem_collectionItem_type {
  __typename: "CollectionType";
  id: string;
  title: string;
  slug: string;
  /**
   * fixme: must be `[CollectionTypeFieldInterface!]!`.
   */
  fields: GetCollectionItem_collectionItem_type_fields[] | null;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type {
  __typename:
    | "CollectionTypeFieldCheck"
    | "CollectionTypeFieldColor"
    | "CollectionTypeFieldDateTime"
    | "CollectionTypeFieldEmail"
    | "CollectionTypeFieldFile"
    | "CollectionTypeFieldGallery"
    | "CollectionTypeFieldImage"
    | "CollectionTypeFieldLink"
    | "CollectionTypeFieldMap"
    | "CollectionTypeFieldMultiReference"
    | "CollectionTypeFieldNumber"
    | "CollectionTypeFieldPassword"
    | "CollectionTypeFieldPhone"
    | "CollectionTypeFieldReference"
    | "CollectionTypeFieldRichText"
    | "CollectionTypeFieldSelect"
    | "CollectionTypeFieldSwitch"
    | "CollectionTypeFieldText"
    | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type_collectionType;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldCheck {
  __typename:
    | "CollectionItemFieldCheck"
    | "CollectionItemFieldColor"
    | "CollectionItemFieldDateTime"
    | "CollectionItemFieldEmail"
    | "CollectionItemFieldFile"
    | "CollectionItemFieldGallery"
    | "CollectionItemFieldImage"
    | "CollectionItemFieldLink"
    | "CollectionItemFieldMap"
    | "CollectionItemFieldNumber"
    | "CollectionItemFieldPassword"
    | "CollectionItemFieldPhone"
    | "CollectionItemFieldRichText"
    | "CollectionItemFieldSelect"
    | "CollectionItemFieldSwitch"
    | "CollectionItemFieldVideoLink";
  id: string;
  type: GetCollectionItem_collectionItem_fields_CollectionItemFieldCheck_type;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldText_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldText_type {
  __typename:
    | "CollectionTypeFieldCheck"
    | "CollectionTypeFieldColor"
    | "CollectionTypeFieldDateTime"
    | "CollectionTypeFieldEmail"
    | "CollectionTypeFieldFile"
    | "CollectionTypeFieldGallery"
    | "CollectionTypeFieldImage"
    | "CollectionTypeFieldLink"
    | "CollectionTypeFieldMap"
    | "CollectionTypeFieldMultiReference"
    | "CollectionTypeFieldNumber"
    | "CollectionTypeFieldPassword"
    | "CollectionTypeFieldPhone"
    | "CollectionTypeFieldReference"
    | "CollectionTypeFieldRichText"
    | "CollectionTypeFieldSelect"
    | "CollectionTypeFieldSwitch"
    | "CollectionTypeFieldText"
    | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItem_collectionItem_fields_CollectionItemFieldText_type_collectionType;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldText_textValues {
  __typename: "CollectionItemFieldTextValues";
  value: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldText {
  __typename: "CollectionItemFieldText";
  id: string;
  type: GetCollectionItem_collectionItem_fields_CollectionItemFieldText_type;
  textValues: GetCollectionItem_collectionItem_fields_CollectionItemFieldText_textValues;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type {
  __typename:
    | "CollectionTypeFieldCheck"
    | "CollectionTypeFieldColor"
    | "CollectionTypeFieldDateTime"
    | "CollectionTypeFieldEmail"
    | "CollectionTypeFieldFile"
    | "CollectionTypeFieldGallery"
    | "CollectionTypeFieldImage"
    | "CollectionTypeFieldLink"
    | "CollectionTypeFieldMap"
    | "CollectionTypeFieldMultiReference"
    | "CollectionTypeFieldNumber"
    | "CollectionTypeFieldPassword"
    | "CollectionTypeFieldPhone"
    | "CollectionTypeFieldReference"
    | "CollectionTypeFieldRichText"
    | "CollectionTypeFieldSelect"
    | "CollectionTypeFieldSwitch"
    | "CollectionTypeFieldText"
    | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type_collectionType;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems {
  __typename: "CollectionItemReference";
  id: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues {
  __typename: "CollectionItemFieldMultiReferenceValues";
  collectionItems: GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues_collectionItems[];
}

export interface GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference {
  __typename: "CollectionItemFieldMultiReference";
  id: string;
  type: GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_type;
  multiReferenceValues: GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference_multiReferenceValues;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_type_collectionType {
  __typename: "CollectionType";
  id: string;
  title: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_type {
  __typename:
    | "CollectionTypeFieldCheck"
    | "CollectionTypeFieldColor"
    | "CollectionTypeFieldDateTime"
    | "CollectionTypeFieldEmail"
    | "CollectionTypeFieldFile"
    | "CollectionTypeFieldGallery"
    | "CollectionTypeFieldImage"
    | "CollectionTypeFieldLink"
    | "CollectionTypeFieldMap"
    | "CollectionTypeFieldMultiReference"
    | "CollectionTypeFieldNumber"
    | "CollectionTypeFieldPassword"
    | "CollectionTypeFieldPhone"
    | "CollectionTypeFieldReference"
    | "CollectionTypeFieldRichText"
    | "CollectionTypeFieldSelect"
    | "CollectionTypeFieldSwitch"
    | "CollectionTypeFieldText"
    | "CollectionTypeFieldVideoLink";
  id: string;
  slug: string | null;
  collectionType: GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_type_collectionType;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues_collectionItem {
  __typename: "CollectionItemReference";
  id: string;
}

interface GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues {
  __typename: "CollectionItemFieldReferenceValues";
  collectionItem: GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues_collectionItem;
}

export interface GetCollectionItem_collectionItem_fields_CollectionItemFieldReference {
  __typename: "CollectionItemFieldReference";
  id: string;
  type: GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_type;
  referenceValues: GetCollectionItem_collectionItem_fields_CollectionItemFieldReference_referenceValues;
}

type GetCollectionItem_collectionItem_fields =
  | GetCollectionItem_collectionItem_fields_CollectionItemFieldCheck
  | GetCollectionItem_collectionItem_fields_CollectionItemFieldText
  | GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference
  | GetCollectionItem_collectionItem_fields_CollectionItemFieldReference;

export interface GetCollectionItem_collectionItem {
  __typename: "CollectionItem";
  id: string;
  title: string;
  slug: string;
  status: CollectionItemStatus;
  pageData: string | null;
  createdAt: string;
  type: GetCollectionItem_collectionItem_type;
  fields: GetCollectionItem_collectionItem_fields[] | null;
}
