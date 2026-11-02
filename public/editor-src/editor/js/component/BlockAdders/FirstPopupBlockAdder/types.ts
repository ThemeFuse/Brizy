import type { PromptGlobalBlock } from "visual/component/Prompts/PromptBlocks/Global/types";
import type { PromptBlock } from "visual/component/Prompts/PromptBlocks/types";
import type { DeviceMode } from "visual/types";

export interface Props {
  deviceMode: DeviceMode;
  onAddBlock: (data: PromptBlock) => void;
  onAddGlobalPopup: (data: PromptGlobalBlock<"popup">) => void;
  setDeviceMode: (device: DeviceMode) => void;
}
