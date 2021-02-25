/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CollectionFieldTypeName {
  check = "check",
  color = "color",
  dateTime = "dateTime",
  email = "email",
  file = "file",
  gallery = "gallery",
  image = "image",
  map = "map",
  multiReference = "multiReference",
  number = "number",
  password = "password",
  reference = "reference",
  richText = "richText",
  select = "select",
  switch = "switch",
  text = "text",
}

export enum CollectionItemStatus {
  draft = "draft",
  published = "published",
}

export interface CollectionItemFieldInput {
  type: string;
  values: any;
}

export interface SeoPropsInput {
  title?: string | null;
  description?: string | null;
}

export interface SocialPropsInput {
  title?: string | null;
  description?: string | null;
  image?: string | null;
}

export interface createCollectionItemInput {
  type: string;
  template?: string | null;
  status?: CollectionItemStatus | null;
  fields?: CollectionItemFieldInput[] | null;
  title: string;
  slug?: string | null;
  seo?: SeoPropsInput | null;
  social?: SocialPropsInput | null;
  clientMutationId?: string | null;
}

export interface createTemplateInput {
  title: string;
  type: string;
  data: string;
  clientMutationId?: string | null;
}

export interface deleteCollectionItemInput {
  id: string;
  clientMutationId?: string | null;
}

export interface updateCollectionItemInput {
  id: string;
  template?: string | null;
  status?: CollectionItemStatus | null;
  fields?: CollectionItemFieldInput[] | null;
  title?: string | null;
  slug?: string | null;
  seo?: SeoPropsInput | null;
  social?: SocialPropsInput | null;
  clientMutationId?: string | null;
}

export interface updateTemplateInput {
  id: string;
  title?: string | null;
  data?: string | null;
  clientMutationId?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
