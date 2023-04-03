import { IconsName } from "../EditorIcon/types";
import { WithClassName } from "../types/attributes";

export interface Props extends WithClassName {
  onClick?: VoidFunction;
  title?: string;
  tooltipContent?: string;
  isLoading: boolean;
  icon: IconsName;
}
