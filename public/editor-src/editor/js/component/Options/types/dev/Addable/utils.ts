import { includes } from "es-toolkit/compat";
import { OptionGroup, SidebarAlignment } from "./types";

const ALIGN_KEY = "brz-addableSidebarAlign";

function getLocalStorage(): Storage | null {
  if (window.localStorage) {
    return window.localStorage;
  } else {
    return null;
  }
}

function isSidebarAlignment(align: unknown): align is SidebarAlignment {
  return includes(SidebarAlignment, align);
}

export function setSidebarAlignment(alignment: SidebarAlignment) {
  const storage = getLocalStorage();
  storage?.setItem(ALIGN_KEY, alignment);
}

export function getSidebarAlignment(): SidebarAlignment {
  const storage = getLocalStorage();
  const align = storage?.getItem(ALIGN_KEY);
  return isSidebarAlignment(align) ? align : SidebarAlignment.right;
}

export function getGroupsOrder(
  optionGroups: Array<OptionGroup>
): Array<{ id: string; title: string }> {
  return optionGroups.map(({ id, title }) => ({
    id,
    title
  }));
}

export const clickExceptions = [".brz-ed-option-type__addable"];
