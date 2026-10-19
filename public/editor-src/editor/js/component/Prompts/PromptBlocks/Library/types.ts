import type { ComponentType } from "react";
import type {
  SavedBlockAPIMeta,
  SavedLayoutAPIMeta
} from "visual/global/Config/types/configs/blocks/SavedBlocks";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { FontsPayload } from "visual/redux/actions2";
import type { ReduxState } from "visual/redux/types";
import type { ExtraFontStyle } from "visual/types/Style";
import type { BlockScreenshots } from "visual/utils/screenshots/types";
import type {
  BlockCategory,
  BlockTypes,
  PromptBlock,
  PromptBlockMetaType,
  PromptBlockTemplate
} from "../types";

export const BLOCK: BlockTypes = "BLOCK";
export const LAYOUT: BlockTypes = "LAYOUT";
export const POPUP: BlockTypes = "POPUP";

export interface Thumbs extends BlockScreenshots {
  showRemoveIcon: boolean;
  loading: boolean;
  keywords?: string;
  isPro?: boolean;
  isStory?: boolean;
  upgradeToPro?: string;
}

export type LayoutData = Omit<SavedLayoutAPIMeta, "isCloudEntity" | "meta">;
export type SavedData = Omit<SavedBlockAPIMeta, "isCloudEntity" | "meta">;

export type SavedBlockAPIMetaWithoutSync = Omit<
  SavedBlockAPIMeta,
  "synchronizable" | "synchronized"
>;
export type SavedLayoutAPIMetaWithoutSync = Omit<
  SavedLayoutAPIMeta,
  "synchronizable" | "synchronized"
>;

export interface SavedLayoutWithThumbs extends LayoutData, Thumbs {
  type: "LAYOUT";
}

export const isSavedLayoutWithThumbs = (
  item: BlockData
): item is SavedLayoutWithThumbs => item.type === "LAYOUT";

interface SavedBlockWithThumbs extends SavedData, Thumbs {
  type: "BLOCK" | "POPUP";
}

export type BlockData = SavedLayoutWithThumbs | SavedBlockWithThumbs;

export interface Pagination {
  page: number;
  done: boolean;
}

export type LibraryProps = {
  type: PromptBlockMetaType;
  showSearch: boolean;
  showTitle: boolean;
  onAddBlocks: (b: PromptBlock | PromptBlockTemplate) => void;
  onClose: () => void;
  HeaderSlotLeft: ComponentType;
  getParentNode?: () => HTMLElement | null;
  config: ConfigCommon;
};

export type LibraryStateProps = {
  projectFonts: ReduxState["fonts"];
  projectExtraFontStyles: ReduxState["extraFontStyles"];
  isAuthorized: boolean;
};

export type LibraryState = {
  activeType?: BlockCategory;
  detailsData?: BlockData;
  search: string;
  filter?: string;
  loading: boolean;
  data: Partial<Record<BlockTypes, BlockData[]>>;
  types: BlockCategory[];
  importLoading: boolean;
  exportLoading: boolean;
  updateLoading: boolean;
};

export type GetAssets = {
  fonts: FontsPayload;
  extraFontStyles?: ExtraFontStyle[];
};
