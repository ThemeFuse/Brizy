import { ToolbarItemsProps } from "visual/component/Toolbar/ToolbarItems";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { DeviceMode } from "visual/types";

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
