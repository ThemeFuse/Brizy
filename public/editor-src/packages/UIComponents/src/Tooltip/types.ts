import { CSSProperties, MouseEvent, ReactNode, RefObject } from "react";
import { WithClassName } from "../types/attributes";

export type ToolbarItemsInstance = {
  toolbarRef: React.RefObject<HTMLDivElement>;
  toolbarCSSPosition: "fixed" | "absolute";
  toolbarItemIndex: number;
  toolbarItemsLength: number;
};

export type Placement =
  | "auto"
  | "auto-start"
  | "auto-end"
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "right"
  | "right-start"
  | "right-end"
  | "left"
  | "left-start"
  | "left-end";

export type Size = "small" | "medium" | "large" | "xlarge" | "auto";

export interface ContentProps extends WithClassName {
  isOpen?: boolean;
  placement: Placement;
  showArrow?: boolean;
  size?: Size;
  offset?: number;
  toolbar?: ToolbarItemsInstance;
  node?: HTMLElement;
}

export interface ContentState {
  placement: Placement;
  placementStyle: CSSProperties;
  arrowPlacement: "top" | "bottom";
  arrowPlacementStyle: CSSProperties;
}

export type TooltipItemProps = {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

export interface Props
  extends WithClassName,
    Omit<ContentProps, "node" | "isOpen"> {
  overlayClassName?: string;
  showOnClick?: boolean;
  closeDelay?: number;
  overlay?: ReactNode;
  title?: string;
  isInPortal?: boolean;
  portalNode?: HTMLElement;
  clickOutsideExceptions?: string[];
  nodeRef?: RefObject<HTMLElement>;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
}

export interface State {
  isOpen: boolean;
  isHidden: boolean;
  needClose: boolean;
}
