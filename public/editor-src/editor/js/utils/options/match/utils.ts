import { match } from "fp-utilities";
import {
  ToolbarItemType,
  ToolbarItemTypeWithChildOption,
  ToolbarItemTypeWithColumns,
  ToolbarItemTypeWithOptions,
  ToolbarItemTypeWithTabs
} from "visual/editorComponents/ToolbarItemType";
import { isOption } from "visual/utils/options/utils";
import * as Obj from "visual/utils/reader/object";
import type { ToolbarItemTypeWithChildrens } from "./types";

export const hasColumns = (
  o: ToolbarItemType
): o is ToolbarItemTypeWithColumns => Array.isArray(Obj.readKey("columns")(o));

export const hasOptions = (
  o: ToolbarItemType
): o is ToolbarItemTypeWithOptions => Array.isArray(Obj.readKey("options")(o));

export const hasTabs = (o: ToolbarItemType): o is ToolbarItemTypeWithTabs =>
  Array.isArray(Obj.readKey("tabs")(o));

export const isPopulationWithOption = (
  o: ToolbarItemType
): o is ToolbarItemTypeWithChildOption => {
  const option = Obj.read(o);

  return (
    Obj.isObject(option) &&
    Obj.hasKey("type", option) &&
    option.type === "population" &&
    Obj.hasKey("option", option) &&
    isOption(option.option)
  );
};

export const getChildOptions: (
  o: ToolbarItemTypeWithChildrens
) => ToolbarItemType[] = match(
  [hasColumns, (o) => o.columns],
  [hasOptions, (o) => o.options],
  [hasTabs, (o) => o.tabs]
);
