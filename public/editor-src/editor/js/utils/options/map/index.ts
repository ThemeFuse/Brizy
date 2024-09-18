import { OptionName } from "visual/component/Options/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Map, withColumns, withOptions, withTabs } from "./maps";

type Maps = {
  [T in OptionName]: Map<T> | undefined;
};

const fns: Maps = {
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
  grid: withColumns,
  group: withOptions,
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
  popover: withOptions,
  showOnDevice: undefined,
  population: undefined,
  radioGroup: undefined,
  range: undefined,
  select: undefined,
  sidebarTabs: withTabs,
  sidebarTabsButton: undefined,
  slider: undefined,
  stateMode: withOptions,
  switch: undefined,
  tabs: withTabs,
  textarea: undefined,
  textShadow: undefined,
  toggle: undefined,
  transform: undefined,
  typography: undefined,
  savedBlock: undefined,
  globalBlock: undefined,
  formApps: undefined,
  checkGroup: undefined,
  gbCondition: undefined,
  popupCondition: undefined,
  toggleButton: undefined,
  //@ts-expect-error Old option, here should not be "popover" option, it will be removed when all toolbars will work with "popover"
  "legacy-popover": withOptions,
  editableSelect: undefined
};

export function _map(
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: ToolbarItemType
): ToolbarItemType {
  const mapped = f(t);
  const map = fns[mapped.type] as Map<OptionName>;

  return map
    ? map((t: ToolbarItemType): ToolbarItemType => _map(f, t), mapped)
    : mapped;
}

export function map<T extends ToolbarItemType>(
  f: (t: ToolbarItemType) => ToolbarItemType
): (item: T) => ToolbarItemType;
export function map<T extends ToolbarItemType>(
  f: (t: ToolbarItemType) => ToolbarItemType,
  item: T
): ToolbarItemType;
export function map<T extends ToolbarItemType>(
  ...args:
    | [(t: ToolbarItemType) => ToolbarItemType]
    | [(t: ToolbarItemType) => ToolbarItemType, T]
): ((t: T) => ToolbarItemType) | ToolbarItemType {
  return args.length === 1 ? (t) => _map(args[0], t) : _map(args[0], args[1]);
}
