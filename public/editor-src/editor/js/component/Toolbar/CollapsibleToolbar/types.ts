import type { ToolbarItemsProps } from "visual/component/Toolbar/ToolbarItems";
import type { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { DeviceMode } from "visual/types";

export interface CollapsibleToolbarProps
  extends Omit<ToolbarItemsProps, "items"> {
  getItems: () => OptionDefinition[];
  getSidebarItems?: () => OptionDefinition[];
  getSidebarTitle?: () => string;
  className?: string;
  animation?: "leftToRight" | "rightToLeft";
  global: boolean;
  membership: boolean;
  language: boolean;
  config: ConfigCommon;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface CollapsibleToolbarState {
  opened: boolean;
}

export interface PropsWithState extends CollapsibleToolbarProps {
  device: DeviceMode;
}
