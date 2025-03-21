import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { isT } from "visual/utils/value";

export const withOptions = <T extends "popover" | "stateMode" | "group">(
  f: (t: ToolbarItemType) => ToolbarItemType | undefined,
  t: GenericToolbarItemType<T>
): GenericToolbarItemType<T> | undefined => {
  const options = t.options?.map(f).filter(isT);
  return options?.length ? { ...t, options } : undefined;
};

export const withTabs = <T extends "tabs" | "sidebarTabs">(
  f: (t: ToolbarItemType) => ToolbarItemType | undefined,
  t: GenericToolbarItemType<T>
): GenericToolbarItemType<T> | undefined => {
  const tabs = (
    t.tabs as Array<{ options?: ToolbarItemType[]; disabled?: boolean }>
  )
    ?.filter((tab) => !tab.disabled)
    ?.map((tab) => ({ ...tab, options: tab.options?.map(f).filter(isT) }))
    .filter((tab) => (tab.options?.length ?? 0) > 0);

  const length =
    tabs?.reduce((acc, t) => (t.options?.length ?? 0) + acc, 0) ?? 0;

  return length > 0
    ? {
        ...t,
        tabs
      }
    : undefined;
};

export const withColumns = <T extends "grid">(
  f: (t: ToolbarItemType) => ToolbarItemType | undefined,
  t: GenericToolbarItemType<T>
): GenericToolbarItemType<T> | undefined => {
  const columns = t.columns
    ?.map((column) => ({
      ...column,
      options: column.options?.map(f).filter(isT)
    }))
    .filter((column) => (column.options?.length ?? 0) > 0);

  const length =
    columns?.reduce((acc, t) => (t.options?.length ?? 0) + acc, 0) ?? 0;

  return length > 0
    ? {
        ...t,
        columns
      }
    : undefined;
};
