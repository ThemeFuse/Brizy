import { SavedBlock, SavedLayout } from "visual/types";

export type Dictionary<T> = {
  [k: string]: T | undefined;
};

type SavedBlockTypes = SavedBlock | SavedLayout;

export const isSavedLayout = (block: SavedBlockTypes): block is SavedLayout => {
  return "items" in block.data;
};

export const isSavedBlock = (block: SavedBlockTypes): block is SavedLayout => {
  const hasValue = "value" in block.data;
  return hasValue && block.meta.type === "normal";
};

export const isSavedPopup = (block: SavedBlockTypes): boolean => {
  const hasValue = "value" in block.data;
  return hasValue && block.meta.type === "popup";
};
