import { Block, BlockMetaType, ExtraFontStyle, Style } from "visual/types";
import { FontsPayload } from "visual/redux/actions2";

export type PromptTabsId = "template" | "blocks" | "saved" | "global";

export type PromptBlock = {
  fonts: FontsPayload;
  block: Block;
  extraFontStyles?: ExtraFontStyle[];
};

export interface PromptBlockTemplate {
  fonts: FontsPayload;
  blocks: Block[];
  extraFontStyles?: ExtraFontStyle[];
  styles?: Style[];
  currentStyleId?: string;
}

export type PromptBlocksProps = {
  activeTab?: PromptTabsId;
  type: BlockMetaType;
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
  onChangeGlobal?: (b: PromptBlock) => void;
  onClose?: () => void;
};

export type PromptBlocksState = {
  currentTab: PromptTabsId;
};

export type BlockTypes = "BLOCK" | "LAYOUT" | "POPUP";

export type BlockCategory = {
  id: BlockTypes;
  title: string;
  icon: string;
};
