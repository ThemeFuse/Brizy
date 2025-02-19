import { PromptGlobalBlock } from "visual/component/Prompts/PromptBlocks/Global/types";
import { PromptBlock } from "visual/component/Prompts/PromptBlocks/types";
import { DeviceMode } from "visual/types";

export interface Props {
  deviceMode: DeviceMode;
  onAddBlock: (data: PromptBlock) => void;
  onAddGlobalPopup: (data: PromptGlobalBlock<"popup">) => void;
  setDeviceMode: (device: DeviceMode) => void;
}
