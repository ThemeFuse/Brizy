import {
  RightSidebarStore,
  RightSidebarState,
  RightSidebarProps
} from "./index";
import { OptionDefinition } from "../Options/Type";

export function toggleLock(
  store: RightSidebarStore,
  state: RightSidebarState
): { store: RightSidebarStore; state: RightSidebarState } {
  const { isOpen, lock } = store;
  const { items } = state;

  const retStore: RightSidebarStore = {
    ...store,
    isOpen:
      lock !== undefined && (items === undefined || items.length === 0)
        ? false
        : isOpen,
    lock: lock === "manual" ? undefined : "manual"
  };
  const retState: RightSidebarState =
    retStore.isOpen === false
      ? {
          items: undefined,
          staleItems: undefined,
          title: undefined,
          staleTitle: undefined
        }
      : state;

  return {
    store: retStore,
    state: retState
  };
}

export function toggleAlignment(store: RightSidebarStore): RightSidebarStore {
  return {
    ...store,
    alignment: store.alignment === "left" ? "right" : "left"
  };
}

export function getTitle(
  props: Pick<RightSidebarProps, "isOpen">,
  state: Pick<RightSidebarState, "title" | "staleTitle">
): string | undefined {
  const { isOpen } = props;
  const { title, staleTitle } = state;

  return isOpen ? title : staleTitle ?? title;
}

export function getItems(
  props: Pick<RightSidebarProps, "isOpen">,
  state: Pick<RightSidebarState, "items" | "staleItems">
): OptionDefinition[] | undefined {
  const { isOpen } = props;
  const { items, staleItems } = state;

  if (isOpen) {
    if (items?.length) {
      return items;
    }
  } else {
    if (staleItems?.length) {
      return staleItems;
    }

    if (items?.length) {
      return items;
    }
  }
}
