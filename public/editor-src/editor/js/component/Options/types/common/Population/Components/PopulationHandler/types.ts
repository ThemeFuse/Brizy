import { ConfigHandler, Base } from "../../types/Props";
import { Value } from "../../types/Value";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

// Make required choices
type Common = Required<ConfigHandler> & Base;

export interface Props extends Common {
  className?: string;
  value: Value;
  option?: ToolbarItemType;
  onChange: (s: Value) => void;
}
