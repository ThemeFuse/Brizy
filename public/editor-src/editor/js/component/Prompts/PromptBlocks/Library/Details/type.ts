import {
  BlockData,
  SavedLayoutWithThumbs
} from "visual/component/Prompts/PromptBlocks/Library/types";

export interface Props {
  data: SavedLayoutWithThumbs;
  onClose: VoidFunction;
  onBack: VoidFunction;
  onAddBlocks: (b: BlockData, replaceStyle: boolean) => void;
}

export interface State {
  thumbnailHeight: number;
  transition: number;
  loading: boolean;
  previewPointer: "none" | "auto";
  replaceStyle: boolean;
}
