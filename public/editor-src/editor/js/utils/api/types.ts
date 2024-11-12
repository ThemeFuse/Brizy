import { Sources } from "visual/editorComponents/Posts/types";
import { Dictionary } from "visual/types/utils";

export enum AutoSave {
  publish = 0,
  draft = 1
}

export interface ResponseWithBody<T> {
  status: number;
  ok: boolean;
  data: T;
}

//#region dynamic content

export type GetDynamicContent = (args: {
  placeholders: Dictionary<string[]>;
  signal?: AbortSignal;
}) => Promise<Dictionary<string[]>>;

//#endregion

export type GetTerms = (taxonomy: string) => Promise<
  {
    name: string;
    term_id: number;
    slug: string;
  }[]
>;

export type GetAuthors = (data?: {
  search?: string;
  include?: string[];
  abortSignal?: AbortSignal;
}) => Promise<{ ID: number; display_name: string }[]>;

export type GetTermsBy = (data?: {
  search?: string;
  include?: [string, string][];
  abortSignal?: AbortSignal;
}) => Promise<
  { term_id: number; name: string; taxonomy: string; taxonomy_name: string }[]
>;

export type GetPosts = (data?: {
  search?: string;
  include?: string[];
  postType?: string[];
  excludePostType?: string[];
  abortSignal?: AbortSignal;
}) => Promise<{ ID: number; title: string; permalink: string }[]>;

export type GetPostTaxonomies = (data: {
  taxonomy: string;
  abortSignal?: AbortSignal;
}) => Promise<
  {
    name: string;
    label: string;
    public: boolean;
    hierarchical: boolean;
    labels: { name: string; singular_name: string };
  }[]
>;

interface CloudCollectionSourceType {
  id: string;
  title: string;
  slug?: string;
}
export type GetCollectionSourceTypes = () => Promise<
  CloudCollectionSourceType[]
>;

export interface CollectionItem {
  id: string;
  title: string;
  status: string;
}

export interface CollectionSourceItem {
  id: string;
  title: string;
  type: string;
}

export interface BlogSourceItem {
  id: string;
  title: string;
}

export type GetCollectionSourceItems = (
  id: string
) => Promise<CollectionSourceItem[]>;

interface WPCollectionSourceType {
  name: string;
  label: string;
}
export type GetWPCollectionSourceTypes = () => Promise<
  WPCollectionSourceType[]
>;

interface WPCollectionSourceItem {
  ID: number;
  post_title: string;
  title: string;
}
export type GetWPCollectionSourceItems = (
  id: string
) => Promise<{ posts: WPCollectionSourceItem[] }>;

//#region rules

export interface Rule {
  id: string;
  blog_id?: string;
  title: string;
  type: string;
}

export interface SelectedItem extends Rule {
  selected: true;
}

//#endregion

export type GetRulePostsGroupList = (p: string) => Promise<
  {
    title: string;
    value: number;
    items?: {
      title: string;
      value: number;
      groupValue: string;
      status?: "publish" | "draft" | "pending";
    }[];
  }[]
>;

//#region Posts

export interface PostsSources {
  sources: Sources[];
}

//#endregion

//#region AdobeFonts

interface AdobeFamily {
  id: string;
  family: string;
  category: string;
  subsets: string[];
  variants: string[];
}

export interface AdobeFonts {
  kit: {
    id: string;
    families: AdobeFamily[];
  };
}

export interface AdobeAddAccount {
  status: number;
}

//#endregion

//#region Icons

export interface UploadIconData {
  acceptedExtensions: string[];
}

//#endregion
