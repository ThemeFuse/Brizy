import {
  EntityTypeRule,
  SavedBlock,
  SavedLayout,
  WPReferenceAllAuthor,
  WPReferenceAllInEntity,
  WPReferenceChildEntity,
  WPReferenceSpecificAuthor,
  WPReferenceSpecificInEntity
} from "visual/types";

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

//#region Rules
export const isReferenceAllAuthor = (
  t: EntityTypeRule
): t is WPReferenceAllAuthor => {
  if (typeof t !== "string" || !t.startsWith("author|")) {
    return false;
  }

  const [_, authorId] = t.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars

  return authorId === "";
};

export const isReferenceSpecificAuthor = (
  t: EntityTypeRule
): t is WPReferenceSpecificAuthor => {
  if (typeof t !== "string") {
    return false;
  }

  if (!t.startsWith("author|")) {
    return false;
  }

  const [_, authorId] = t.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars

  return authorId !== "";
};

export const isReferenceAllIn = (
  t: EntityTypeRule
): t is WPReferenceAllInEntity => {
  if (typeof t !== "string") {
    return false;
  }

  if (!t.startsWith("in|")) {
    return false;
  }

  const [_, taxonomy, id] = t.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars

  return taxonomy !== "" && id === undefined;
};

export const isReferenceSpecificIn = (
  t: EntityTypeRule
): t is WPReferenceSpecificInEntity => {
  if (typeof t !== "string") {
    return false;
  }

  if (!t.startsWith("in|")) {
    return false;
  }

  const [_, taxonomy, id] = t.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars

  return taxonomy !== "" && id !== undefined;
};

export const isReferenceAllChild = (
  t: EntityTypeRule
): t is WPReferenceChildEntity => {
  if (typeof t !== "string") {
    return false;
  }

  if (!t.startsWith("child|")) {
    return false;
  }

  const [_, category, id] = t.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars

  return category !== "" && id === undefined;
};

export const isReferenceSpecificChild = (
  t: EntityTypeRule
): t is WPReferenceChildEntity => {
  if (typeof t !== "string") {
    return false;
  }

  if (!t.startsWith("child|")) {
    return false;
  }

  const [_, category, id] = t.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars

  return category !== "" && id !== undefined;
};

//#endregion
