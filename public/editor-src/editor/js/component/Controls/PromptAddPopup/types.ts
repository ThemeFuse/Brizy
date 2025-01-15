import { ReactNode } from "react";
import { Block } from "visual/types";

export interface Props {
  label: ReactNode;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
  onCreate?: VoidFunction;
  block?: Block;
  className?: string;
  canDelete?: boolean;
}
