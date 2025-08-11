import { RefObject } from "react";

export type TooltipPlacement =
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

export interface Props {
  overlay: string;
  offset: number;
  openOnClick?: boolean;
  placement: TooltipPlacement;
  id: string;
  contentRef: RefObject<Element> | null;
  referenceElement: Element | null;
  className: string;
}

export interface TooltipImperativeProps {
  updatePopper: VoidFunction;
  openTooltip: VoidFunction;
  toggleTooltip: VoidFunction;
}
