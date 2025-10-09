import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Dictionary } from "visual/types/utils";
import { RefsById, Sources } from "../elements/posts/types";

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
  config: ConfigCommon;
  signal?: AbortSignal;
}) => Promise<Dictionary<string[]>>;

//#endregion

export type GetTerms = (
  taxonomy: string,
  config: ConfigCommon
) => Promise<
  {
    name: string;
    term_id: number;
    slug: string;
  }[]
>;

export type GetAuthors = (data: {
  search?: string;
  include?: string[];
  abortSignal?: AbortSignal;
  config: ConfigCommon;
}) => Promise<{ ID: number; display_name: string }[]>;

export type GetTermsBy = (data: {
  search?: string;
  include?: [string, string][];
  abortSignal?: AbortSignal;
  config: ConfigCommon;
}) => Promise<
  { term_id: number; name: string; taxonomy: string; taxonomy_name: string }[]
>;

export type GetPosts = (data: {
  search?: string;
  include?: string[];
  postType?: string[];
  excludePostType?: string[];
  abortSignal?: AbortSignal;
  config: ConfigCommon;
}) => Promise<{ ID: number; title: string; permalink: string }[]>;

export type GetPostTaxonomies = (data: {
  taxonomy: string;
  abortSignal?: AbortSignal;
  config: ConfigCommon;
}) => Promise<
  {
    name: string;
    label: string;
    public: boolean;
    hierarchical: boolean;
    labels: { name: string; singular_name: string };
  }[]
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

export interface RulePostGroupList {
  title: string;
  value: string;
  items?: RulePostGroupListItem[];
}

interface RulePostGroupListItem {
  title: string;
  value: string;
  groupValue: string;
  status?: "publish" | "draft" | "pending";
}

export type GetRulePostsGroupList = (
  p: string,
  config: ConfigCommon
) => Promise<RulePostGroupList[]>;

//#region Posts

export interface PostsSources {
  sources: Sources[];
  refsById: RefsById;
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
