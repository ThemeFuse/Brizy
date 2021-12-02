import {
  Screenshot,
  BlockMetaType,
  SavedBlock,
  SavedLayout
} from "visual/types";
import { Dictionary } from "visual/types/utils";

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

//#region Saved blocks

export type GetSavedBlocksMeta = () => Promise<SavedBlockMeta[]>;
export type GetSavedBlockById = (id: string) => Promise<SavedBlock>;
export type CreateSavedBlock = (
  block: SavedBlock & { uid: string },
  meta?: { is_autosave?: 0 | 1 }
) => Promise<unknown>;
export type DeleteSavedBlockById = (id: string) => Promise<unknown>;
export type SavedBlockMeta = {
  uid: string;
  synchronized?: boolean;
  synchronizable?: boolean;
  isCloudEntity?: boolean;
  meta?: Screenshot & {
    extraFontStyles: Array<{ id: string }>;
    type: BlockMetaType;
  };
};
export interface UploadSavedBlocksData {
  errors: { uid: string; message: string }[];
  success: SavedBlock[];
}
export type UploadSavedBlocks = (
  file: FileList
) => Promise<UploadSavedBlocksData>;

//#endregion

//#region Saved popups

export type UploadSavedPopups = (
  file: FileList
) => Promise<{
  errors: { uid: string; message: string }[];
  success: SavedBlock[];
}>;

//#endregion

//#region Saved layouts

export type GetSavedLayoutsMeta = () => Promise<SavedLayoutMeta[]>;
export type GetSavedLayoutById = (id: string) => Promise<SavedLayout>;
export type CreateSavedLayout = (
  layout: SavedLayout & { uid: string },
  meta?: { is_autosave?: 0 | 1 }
) => Promise<unknown>;
export type DeleteSavedLayoutById = (id: string) => Promise<unknown>;
export type SavedLayoutMeta = {
  uid: string;
  synchronized?: boolean;
  synchronizable?: boolean;
  isCloudEntity?: boolean;
  meta?: Screenshot & {
    extraFontStyles: Array<{ id: string }>;
  };
};

export interface UploadSavedLayoutsData {
  errors: { uid: string; message: string }[];
  success: SavedLayout[];
}

export type UploadSavedLayouts = (
  file: FileList
) => Promise<UploadSavedLayoutsData>;

//#endregion

export type GetTerms = (
  taxonomy: string
) => Promise<{
  name: string;
  term_id: number;
  slug: string;
}>;

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

interface CollectionSourceItem {
  slug: string;
  id: string;
  title: string;
}
export type GetCollectionSourceItems = (
  id: string
) => Promise<{ collection: CollectionSourceItem[] }>;

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
