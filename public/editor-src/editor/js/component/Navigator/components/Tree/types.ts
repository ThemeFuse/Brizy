import { CSSProperties, HTMLAttributes } from "react";
import { TreeItem } from "visual/providers/TreeProvider/types";

export interface TreeItemProps {
  item: TreeItem;
  depth: number;
  clone?: boolean;
  wrapperRef?: (element: HTMLElement | null) => void;
  childCount?: number;
  ghost?: boolean;
  handleProps?: HTMLAttributes<HTMLElement>;
  style?: CSSProperties;
  invalid?: boolean;
  showToggleIcon?: boolean;
}
