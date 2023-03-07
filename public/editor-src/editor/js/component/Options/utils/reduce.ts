import { OptionName } from "visual/component/Options/types";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";

export type Reduce<K extends OptionName> = <T>(
  fn: (acc: T, item: ToolbarItemType) => T,
  t0: T,
  item: GenericToolbarItemType<K>
) => T;

export const withOptions = <
  K extends "popover-dev" | "stateMode-dev" | "group-dev",
  T
>(
  fn: (acc: T, item: ToolbarItemType) => T,
  t0: T,
  item: GenericToolbarItemType<K>
): T => item.options?.reduce(fn, t0) ?? t0;

export const withTabs = <K extends "tabs-dev" | "sidebarTabs-dev", T>(
  fn: (acc: T, item: ToolbarItemType) => T,
  t0: T,
  item: GenericToolbarItemType<K>
): T => {
  return (
    // @ts-expect-error, reduce has 2 implementations and TS cannot decided which one to use
    item.tabs?.reduce((acc, tab) => tab.options?.reduce(fn, acc) ?? t0, t0) ??
    t0
  );
};

export const withColumns = <K extends "grid-dev", T>(
  fn: (acc: T, item: ToolbarItemType) => T,
  t0: T,
  item: GenericToolbarItemType<K>
): T => {
  return (
    item.columns?.reduce(
      (acc, column) => column.options?.reduce(fn, acc) ?? t0,
      t0
    ) ?? t0
  );
};
