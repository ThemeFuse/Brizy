import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { FontsPayload } from "visual/redux/actions2";
import type { Block } from "visual/types/Block";
import type {
  BlockMetaType,
  GlobalBlockNormal,
  GlobalBlockPopup
} from "visual/types/GlobalBlock";
import type { ExtraFontStyle, Style } from "visual/types/Style";
import type { PromptGlobalBlock } from "./Global/types";

export type PromptTabsId = "template" | "blocks" | "saved" | "global";

export type PromptBlock = {
  fonts: FontsPayload;
  block: Block;
  extraFontStyles?: ExtraFontStyle[];
};

// Prompts only ever deal with normal and popup global blocks — overlay ones
// (e.g. Cookie Banner) are CMS-only and never go through the block library.
export type PromptBlockMetaType = Exclude<BlockMetaType, "overlay">;

export type NormalOrPopup<T extends PromptBlockMetaType> = T extends "normal"
  ? GlobalBlockNormal
  : GlobalBlockPopup;

export interface PromptBlockTemplate {
  fonts: FontsPayload;
  blocks: Block[];
  extraFontStyles?: ExtraFontStyle[];
  styles?: Style[];
  currentStyleId?: string;
}

export interface PromptBlocksProps<T extends PromptBlockMetaType> {
  activeTab?: PromptTabsId;
  type: T;
  opened?: boolean;

  showTemplate?: boolean;
  showBlocks?: boolean;
  showSaved?: boolean;
  showGlobal?: boolean;

  templateSidebar?: boolean;
  blocksSidebar?: boolean;
  savedSidebar?: boolean;
  globalSidebar?: boolean;

  templateSearch?: boolean;
  blocksSearch?: boolean;
  savedSearch?: boolean;
  globalSearch?: boolean;

  blocksType?: boolean;

  onChangeBlocks?: (b: PromptBlock) => void;
  onChangeTemplate?: (b: PromptBlockTemplate) => void;
  onChangeSaved?: (b: PromptBlockTemplate) => void;
  onChangeGlobal?: (b: PromptGlobalBlock<T>) => void;
  onClose?: () => void;

  config: ConfigCommon;
}

export type PromptBlocksState = {
  currentTab: PromptTabsId;
  isHelpVideoOpened: boolean;
};

export type BlockTypes = "BLOCK" | "LAYOUT" | "POPUP";

export type BlockCategory = {
  id: BlockTypes;
  title: string;
  icon: string;
};

export const ALL_CAT = "All";
export const UNCATEGORISED_CAT = "Uncategorised";
