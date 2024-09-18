import { ConfigChoices, Base } from "../../types/Props";
import { Value } from "../../types/Value";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

// Make required choices
type Common = Required<ConfigChoices> & Base;

export interface Props extends Common {
  className?: string;
  option?: ToolbarItemType;
  value: Value;
  onChange: (v: Value) => void;
}
