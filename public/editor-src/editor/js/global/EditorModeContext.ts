import { createContext } from "react";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";

export type EditorMode = Mode;

type EditorCommonType = "page" | "story" | "popup";

export interface WithEditorMode {
  editorMode: Mode;
}

export const EditorModeContext = createContext<Mode>(Mode.page);

export function isEditorModeContext(mode: string): mode is Mode {
  return Object.keys(Mode).includes(mode);
}

export function isPage(v: string): v is "page" {
  throwErrorIfNotContext(v);
  return v === "page";
}

export const isExternalPopup = (v: string): v is "external_popup" =>
  v === "external_popup";

export const isInternalPopup = (v: string): v is "internal_popup" =>
  v === "internal_popup";

export function isPopup(v: string): v is "popup" {
  throwErrorIfNotContext(v);
  return isExternalPopup(v) || isInternalPopup(v);
}

export const isInternalStory = (v: string): v is "internal_story" =>
  v === "internal_story";

export const isExternalStory = (v: string): v is "external_story" =>
  v === "external_story";

export function isStory(v: string): v is "internal_story" | "external_story" {
  throwErrorIfNotContext(v);
  return isInternalStory(v) || isExternalStory(v);
}

function throwErrorIfNotContext(v: string): void {
  const env = process.env.NODE_ENV;
  if (!isEditorModeContext(v) && (env === "development" || env === "test")) {
    throw new Error("EDITOR MODE context has wrong value:" + v);
  }
}

export function getCommonEditorMode(editorMode: EditorMode): EditorCommonType {
  if (isPopup(editorMode)) {
    return "popup";
  }
  if (isStory(editorMode)) {
    return "story";
  }
  return "page";
}
