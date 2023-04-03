import { MouseEventHandler } from "react";
import { IconsName } from "../EditorIcon/types";
import { WithClassName } from "../types/attributes";

export interface Props extends WithClassName {
  icon: IconsName;
  label: string;
  onClick?: VoidFunction;
  onCheck?: VoidFunction;
  isActive?: boolean;
  isChecked?: boolean;
}

export interface CheckMarkProps extends WithClassName {
  isChecked: boolean;
  onClick?: MouseEventHandler;
}
