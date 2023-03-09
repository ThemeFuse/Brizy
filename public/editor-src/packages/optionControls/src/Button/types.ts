import { ReactNode } from "react";
import { IconsName } from "../EditorIcon/types";
import { WithClassName } from "../types/attributes";

export interface Props extends WithClassName {
  onClick?: VoidFunction;
  reverse?: boolean;
  children?: ReactNode;
  className?: string;
  icon?: IconsName;
  align?: "left" | "center" | "right";
  reverseTheme?: boolean;
  title?: string;
}
