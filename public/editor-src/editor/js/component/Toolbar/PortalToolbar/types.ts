import type { ReactElement, RefObject } from "react";
import type { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { PortalToolbarPositionerProps } from "./PortalToolbarPositioner";

export type PortalToolbarProps = {
  config: ConfigCommon;
  getItems: () => OptionDefinition[];
  getSidebarItems?: () => OptionDefinition[];
  getSidebarTitle?: () => string;
  manualControl?: boolean;
  selector?: string;
  selectorSearchStrategy?: "dom-tree" | "coordinates";
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onEscape?: () => void;
  children?:
    | ReactElement
    | null
    | ((props: {
        open: (e: MouseEvent) => void;
        ref: RefObject<HTMLDivElement> | null;
      }) => ReactElement);
} & Omit<PortalToolbarPositionerProps, "items">;
