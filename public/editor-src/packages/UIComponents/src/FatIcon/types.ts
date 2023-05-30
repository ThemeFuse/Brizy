import { IconsName } from "../EditorIcon/types";
import { WithClassName } from "../types/attributes";

export interface Props extends WithClassName {
  icon: IconsName;
  label: string;
  onClick?: VoidFunction;
  isActive?: boolean;
}
