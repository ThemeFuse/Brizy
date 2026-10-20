import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { Base, ConfigHandler } from "../../types/Props";
import type { Value } from "../../types/Value";

// Make required choices
type Common = Required<ConfigHandler> & Base;

export interface Props extends Common {
  className?: string;
  value: Value;
  option?: ToolbarItemType;
  onChange: (s: Value) => void;
}
