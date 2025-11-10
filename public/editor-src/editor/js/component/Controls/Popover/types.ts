import { PropsWithChildren, ReactElement } from "react";
import { ChangeFunction } from "visual/component/Controls/ColorPicker2/types";
import { Props as TooltipProps } from "visual/component/Controls/Tooltip";
import { WithClassName } from "visual/types/attributes";

export type Props = WithClassName &
  PropsWithChildren<unknown> & {
    toolbar?: TooltipProps["toolbar"];
    trigger: ReactElement;
    onOpen?: VoidFunction;
    onClose?: VoidFunction;
    title?: string;
    size: "small" | "medium" | "large" | "xlarge" | "auto";
    clickOutsideExceptions?: string[];
    placement: TooltipProps["placement"];
    inPortal?: boolean;
  };

interface Option {
  id: string;
  className: string;
  label: string;
  onChange: ChangeFunction;
  type: string;
  value: { hex: string; opacity: number };
  config: { isPaletteHidden: boolean; opacity: boolean };
}

export interface ToolbarItem {
  id: string;
  display: string;
  icon: string;
  config: {
    onOpenDirect: boolean;
  };
  position: number;
  size: string;
  type: string;
  options: Option;
}
