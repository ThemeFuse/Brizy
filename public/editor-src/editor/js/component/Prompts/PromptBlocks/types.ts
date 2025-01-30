import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { FontsPayload } from "visual/redux/actions2";
import { Block } from "visual/types/Block";
import {
  BlockMetaType,
  GlobalBlockNormal,
  GlobalBlockPopup
} from "visual/types/GlobalBlock";
import { ExtraFontStyle, Style } from "visual/types/Style";
import { PromptGlobalBlock } from "./Global/types";

export type PromptTabsId = "template" | "blocks" | "saved" | "global";

export type PromptBlock = {
  fonts: FontsPayload;
  block: Block;
  extraFontStyles?: ExtraFontStyle[];
};

export type NormalOrPopup<T extends BlockMetaType> = T extends "normal"
  ? GlobalBlockNormal
  : GlobalBlockPopup;

export interface PromptBlockTemplate {
  fonts: FontsPayload;
  blocks: Block[];
  extraFontStyles?: ExtraFontStyle[];
  styles?: Style[];
  currentStyleId?: string;
}

export interface PromptBlocksProps<T extends BlockMetaType> {
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
