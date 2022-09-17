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
  link = "link",
  map = "map",
  multiReference = "multiReference",
  number = "number",
  password = "password",
  phone = "phone",
  reference = "reference",
  richText = "richText",
  select = "select",
  switch = "switch",
  text = "text",
  videoLink = "videoLink",
}

export enum CollectionItemStatus {
  draft = "draft",
  published = "published",
}

export enum VisibilityStatus {
  passwordProtected = "passwordProtected",
  public = "public",
}

export interface CodeInjectionInput {
  css?: string | null;
  js?: JSInjectionInput | null;
}

export interface CollectionItemFieldInput {
  type: string;
  values: any;
}

export interface CustomerGroupPropsInput {
  id: string;
}

export interface JSInjectionInput {
  header?: string | null;
  footer?: string | null;
}

export interface SeoPropsInput {
  title?: string | null;
  description?: string | null;
  enableIndexing?: boolean | null;
}

export interface SocialPropsInput {
  title?: string | null;
  description?: string | null;
  image?: string | null;
}

export interface createCollectionItemInput {
  type: string;
  status?: CollectionItemStatus | null;
  fields?: CollectionItemFieldInput[] | null;
  title: string;
  slug?: string | null;
  seo?: SeoPropsInput | null;
  social?: SocialPropsInput | null;
  isHomepage?: boolean | null;
  pageData?: string | null;
  codeInjection?: CodeInjectionInput | null;
  visibility?: VisibilityStatus | null;
  itemPassword?: string | null;
  clientMutationId?: string | null;
}

export interface deleteCollectionItemInput {
  id: string;
  clientMutationId?: string | null;
}

export interface updateCollectionItemInput {
  id: string;
  status?: CollectionItemStatus | null;
  fields?: CollectionItemFieldInput[] | null;
  title?: string | null;
  slug?: string | null;
  seo?: SeoPropsInput | null;
  social?: SocialPropsInput | null;
  isHomepage?: boolean | null;
  pageData?: string | null;
  codeInjection?: CodeInjectionInput | null;
  visibility?: VisibilityStatus | null;
  itemPassword?: string | null;
  clientMutationId?: string | null;
}

export interface updateCustomerInput {
  id: string;
  email?: string | null;
  userName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
  passwordConfirm?: string | null;
  phone?: string | null;
  verifiedEmail?: boolean | null;
  customerGroups?: CustomerGroupPropsInput[] | null;
  sendEmailInvite?: boolean | null;
  pageData?: string | null;
  codeInjection?: CodeInjectionInput | null;
  clientMutationId?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
