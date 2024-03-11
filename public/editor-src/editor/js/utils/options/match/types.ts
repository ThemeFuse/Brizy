import type { OptionName } from "visual/component/Options/types";
import type {
  ToolbarItemTypeWithColumns,
  ToolbarItemTypeWithOptions,
  ToolbarItemTypeWithTabs
} from "visual/editorComponents/ToolbarItemType";
import type { MValue } from "visual/utils/value";

export type OptionChildrensKeys = "options" | "columns" | "tabs";

export type Children = {
  [T in OptionName]: MValue<OptionChildrensKeys>;
};

export type ToolbarItemTypeWithChildrens =
  | ToolbarItemTypeWithColumns
  | ToolbarItemTypeWithOptions
  | ToolbarItemTypeWithTabs;
