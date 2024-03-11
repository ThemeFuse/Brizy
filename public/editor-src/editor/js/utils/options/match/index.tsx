import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { Children, ToolbarItemTypeWithChildrens } from "./types";
import { hasColumns, hasOptions, hasTabs } from "./utils";

export const options: Children = {
  aiText: undefined,
  alert: undefined,
  animation: undefined,
  backgroundColor: undefined,
  border: undefined,
  boxShadow: undefined,
  button: undefined,
  codeMirror: undefined,
  colorPicker: undefined,
  corners: undefined,
  fileUpload: undefined,
  filters: undefined,
  gallery: undefined,
  "gallery-for-gallery": undefined,
  grid: "columns",
  group: "options",
  iconPicker: undefined,
  iconsPicker: undefined,
  iconSetter: undefined,
  imageUpload: undefined,
  inputText: undefined,
  internalLink: undefined,
  margin: undefined,
  motion: undefined,
  multiSelect: undefined,
  number: undefined,
  order: undefined,
  padding: undefined,
  paypal: undefined,
  popover: "options",
  population: undefined,
  radioGroup: undefined,
  range: undefined,
  select: undefined,
  sidebarTabs: "tabs",
  sidebarTabsButton: undefined,
  slider: undefined,
  stateMode: "options",
  switch: undefined,
  tabs: "tabs",
  textarea: undefined,
  textShadow: undefined,
  toggle: undefined,
  typography: undefined,
  transform: undefined,
  savedBlock: undefined,
  globalBlock: undefined,
  formApps: undefined,
  toggleButton: undefined,
  gbCondition: undefined,
  //@ts-expect-error Old option, here should not be "popover" option, it will be removed when all toolbars will work with "popover"
  "legacy-popover": "options"
};

export const hasChilds = (
  o: ToolbarItemType
): o is ToolbarItemTypeWithChildrens =>
  hasColumns(o) || hasOptions(o) || hasTabs(o);
