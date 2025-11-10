import { detectOS } from "visual/utils/dom/detectOS";
import { Item, Meta } from "./types";

export function mergeItems(a: Item[], b: Item[]): Item[] {
  const mergedItems: Item[] = [...a];

  for (let i = 0; i < b.length; i++) {
    let foundMergeTarget = false;
    for (let j = 0; j < a.length; j++) {
      if (b[i].id === a[j].id && b[i].type === a[j].type) {
        foundMergeTarget = true;
        const hasItems = b[i].items && a[j].items;
        mergedItems[j] = {
          ...b[i],
          ...a[j],
          ...(hasItems && {
            items: mergeItems(a[j].items || [], b[i].items || [])
          })
        };
      }
    }

    if (!foundMergeTarget) {
      mergedItems.push(b[i]);
    }
  }

  return mergedItems;
}

export function concatItems(a: Item[], b: Item[]): Item[] {
  return [...a, ...b];
}

export function filterItems(items: Item[], meta: Meta): Item[] {
  return items.filter((item, index) => {
    if (typeof item.disabled === "function") {
      return !item.disabled(item, {
        ...meta,
        isInSubMenu: !(meta.depth === 0 && index === 0)
      });
    }

    return !item.disabled;
  });
}

const os = detectOS();
export const isMac = os === "MacOS";

export const getKeyModifierSubMenu = (
  isInSubMenu: boolean
): "alt" | "⌘" | "ctrl" => {
  if (isMac) {
    return isInSubMenu ? "alt" : "⌘";
  } else {
    return isInSubMenu ? "alt" : "ctrl";
  }
};

export const getDeleteKeySubMenu = (isInSubMenu: boolean): string => {
  if (isMac) {
    return isInSubMenu ? "alt + delete" : "⌘ + delete";
  } else {
    return isInSubMenu ? "alt + delete" : "ctrl + delete";
  }
};

export const copyKeyModifier = isMac ? "⌘ + C" : "ctrl + C";
export const pasteKeyModifier = isMac ? "⌘ + V" : "ctrl + V";
export const pasteStylesKeyModifier = isMac ? "⌘ + ⇧ + V" : "Ctrl + ⇧ + V";
export const duplicateKeyModifier = isMac ? "⌘ + D" : "Ctrl + D";
export const deleteKeyModifier = isMac ? "⌘ + delete" : "ctrl + delete";
export const navigatorKeyModifier = isMac ? "⌘ + E" : "ctrl + E";
