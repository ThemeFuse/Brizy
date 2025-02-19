import { Obj } from "@brizy/readers";
import { pass } from "fp-utilities";
import { isWp } from "visual/global/Config";
import {
  ConfigCommon,
  LeftSidebarAddElementsType,
  LeftSidebarOptionBase,
  LeftSidebarOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { SavedBlock, SavedLayout } from "visual/types";
import { checkValue2 } from "visual/utils/checkValue";
import {
  GlobalBlock,
  GlobalBlockNormal,
  GlobalBlockPopup
} from "./GlobalBlock";
import { Page, PageWP } from "./Page";
import {
  EntityTypeRule,
  WPReferenceAllAuthor,
  WPReferenceAllInEntity,
  WPReferenceChildEntity,
  WPReferenceSpecificAuthor,
  WPReferenceSpecificInEntity
} from "./Rule";
import { ExtraFontStyle, Style, TextScripts } from "./Style";

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

  const [, authorId] = t.split("|");

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

  const [, authorId] = t.split("|");

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

  const [, taxonomy, id] = t.split("|");

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

  const [, taxonomy, id] = t.split("|");

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

  const [, category, id] = t.split("|");

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

  const [, category, id] = t.split("|");

  return category !== "" && id !== undefined;
};

//#endregion

//#region Global Blocks

export const isGlobalBlock = (b: GlobalBlock): b is GlobalBlockNormal => {
  return b.meta.type === "normal";
};

export const isGlobalPopup = (b: GlobalBlock): b is GlobalBlockPopup => {
  return b.meta.type === "popup";
};

//#endregion

// #region LeftSidebar
export const isLeftSidebarAddElements = (
  v: LeftSidebarOptionBase
): v is LeftSidebarAddElementsType =>
  Obj.isObject(v) &&
  v.type === LeftSidebarOptionsIds.addElements &&
  Obj.hasKey("elements", v);

// #endregion

export const isWPPage = (
  _page: Page,
  config: ConfigCommon
): _page is PageWP => {
  return isWp(config);
};

//#region FontStyles

const isScript = (v: string): v is TextScripts =>
  !!checkValue2<TextScripts>(TextScripts)(v);

export const fromStringToScript = pass(isScript);

export const isFontStyle = (item: unknown): item is ExtraFontStyle =>
  Obj.isObject(item) &&
  Obj.hasKeys(
    [
      "id",
      "title",
      "fontFamily",
      "fontFamilyType",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "tabletFontSize",
      "tabletFontWeight",
      "tabletLineHeight",
      "tabletLetterSpacing",
      "mobileFontSize",
      "mobileFontWeight",
      "mobileLineHeight",
      "mobileLetterSpacing",
      "deletable"
    ],
    item
  );

export const isStyle = (item: unknown): item is Style =>
  Obj.isObject(item) &&
  Obj.hasKeys(["id", "title", "fontStyles", "colorPalette"], item);

export const isExtraFontStyle = (item: unknown): item is ExtraFontStyle =>
  isFontStyle(item) && item.deletable === "on";

//#endregion
