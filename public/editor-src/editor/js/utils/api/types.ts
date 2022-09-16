import { SavedBlock, SavedLayout } from "visual/types";
import { Dictionary } from "visual/types/utils";

interface Pagination {
  count: number;
  page: number;
  order?: "DESC" | "ASC";
  orderBy?: string;
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

//#region Screenshots

export type CreateScreenshot = (
  data: ScreenshotData
) => Promise<{ id: string }>;
export type UpdateScreenshot = (
  data: ScreenshotData & { id: string }
) => Promise<{ id: string }>;
type ScreenshotData = {
  base64: string;
  blockType: "normal" | "global" | "saved" | "layout";
};

//#endregion

type SyncBlock<T> = T & {
  synchronizable: boolean;
  synchronized: boolean;
  isCloudEntity: boolean;
};
type WithUid<T> = T & { uid: string };

export type SavedBlockAPI = SyncBlock<WithUid<SavedBlock>>;

//#region Saved blocks

type SavedBlockWithoutData = Omit<SavedBlock, "data">;
export type SavedBlockMeta = SyncBlock<WithUid<SavedBlockWithoutData>>;

export type GetSavedBlocksMeta = (
  pagination?: Pagination
) => Promise<SavedBlockMeta[]>;
export type GetSavedBlockById = (id: string) => Promise<SavedBlock>;
export type CreateSavedBlock = (
  block: WithUid<SavedBlock>,
  meta?: { is_autosave?: 0 | 1 }
) => Promise<unknown>;
export type DeleteSavedBlockById = (id: string) => Promise<unknown>;

export interface UploadSavedBlocksData {
  errors: { uid: string; message: string }[];
  success: SavedBlockAPI[];
}
export type UploadSavedBlocks = (
  file: FileList
) => Promise<UploadSavedBlocksData>;

//#endregion

//#region Saved popups

export type UploadSavedPopups = (file: FileList) => Promise<{
  errors: { uid: string; message: string }[];
  success: SavedBlockAPI[];
}>;

//#endregion

//#region Saved layouts

type SavedLayoutWithoutData = Omit<SavedLayout, "data">;
export type SavedLayoutMeta = SyncBlock<WithUid<SavedLayoutWithoutData>>;
export type SavedLayoutAPI = SyncBlock<WithUid<SavedLayout>>;

export type GetSavedLayoutsMeta = (
  pagination?: Pagination
) => Promise<SavedLayoutMeta[]>;
export type GetSavedLayoutById = (id: string) => Promise<SavedLayout>;
export type CreateSavedLayout = (
  layout: WithUid<SavedLayout>,
  meta?: { is_autosave?: 0 | 1 }
) => Promise<unknown>;
export type DeleteSavedLayoutById = (id: string) => Promise<unknown>;

export interface UploadSavedLayoutsData {
  errors: { uid: string; message: string }[];
  success: SavedLayoutAPI[];
}

export type UploadSavedLayouts = (
  file: FileList
) => Promise<UploadSavedLayoutsData>;

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
}) => Promise<{ ID: number; title: string }[]>;

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
    status?: "publish" | "draft" | "pending";
    items?: {
      title: string;
      value: number;
      groupValue: string;
    }[];
  }[]
>;

//#region Posts
export type GetPostsSourceRefId = Dictionary<
  Array<{ id: string; type: "single" | "multi"; title: string }>
>;
export type GetPostsSourceRefs = (t: string) => Promise<{
  collectionTypes: Array<{ id: string; slug?: string | null; title: string }>;
  refsById: GetPostsSourceRefId;
}>;

//#endregion
