import {
  Screenshot,
  BlockMetaType,
  SavedBlock,
  SavedLayout
} from "visual/types";

export type GetDynamicContent = (args: {
  placeholders: string[];
  signal?: AbortSignal;
  postId?: string;
}) => Promise<GetDynamicContentResolve>;
export type GetDynamicContentResolve = string[];
export type GetDynamicContentReject = string;

// Screenshot
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

// saved blocks
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

// saved layouts
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
