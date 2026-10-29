import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { Base, ConfigChoices } from "../../types/Props";
import type { Value } from "../../types/Value";

// Make required choices
type Common = Required<ConfigChoices> & Base;

export interface Props extends Common {
  className?: string;
  option?: ToolbarItemType;
  value: Value;
  onChange: (v: Value) => void;
}
