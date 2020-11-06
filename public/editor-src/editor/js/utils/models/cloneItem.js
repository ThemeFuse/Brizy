import { insertItem } from "./insertItem";

export const cloneItem = (items, itemIndex, toIndex = itemIndex + 1) => {
  if (!items[itemIndex]) {
    throw new Error(`Can't clone invalid item at index ${itemIndex}`);
  }

  return insertItem(items, toIndex, items[itemIndex]);
};
