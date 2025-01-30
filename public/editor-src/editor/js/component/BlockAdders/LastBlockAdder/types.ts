import { PromptGlobalBlock } from "visual/component/Prompts/PromptBlocks/Global/types";
import {
  PromptBlock,
  PromptBlockTemplate
} from "visual/component/Prompts/PromptBlocks/types";

export interface Props {
  onAddBlock?: (block: PromptBlock) => void;
  onAddTemplate?: (template: PromptBlockTemplate) => void;
  onAddGlobalBlock?: (block: PromptGlobalBlock<"normal">) => void;
}
