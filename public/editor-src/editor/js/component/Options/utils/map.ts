import { OptionName } from "visual/component/Options/types";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";

export type Map<T extends OptionName> = (
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: GenericToolbarItemType<T>
) => ToolbarItemType;

export const withOptions = <
  T extends "popover-dev" | "stateMode-dev" | "group-dev"
>(
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: GenericToolbarItemType<T>
): GenericToolbarItemType<T> => ({ ...t, options: t.options?.map(f) });

export const withTabs = <T extends "tabs-dev" | "sidebarTabs-dev">(
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: GenericToolbarItemType<T>
): GenericToolbarItemType<T> => ({
  ...t,
  tabs: t.tabs?.map((tab) => ({ ...tab, options: tab.options?.map(f) }))
});

export const withColumns = <T extends "grid-dev">(
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: GenericToolbarItemType<T>
): GenericToolbarItemType<T> => ({
  ...t,
  columns: t.columns?.map((column) => ({
    ...column,
    options: column.options?.map(f)
  }))
});
