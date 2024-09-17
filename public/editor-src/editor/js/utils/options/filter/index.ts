import { OptionName } from "visual/component/Options/types";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { withColumns, withOptions, withTabs } from "./filters";

type Filters = {
  [T in OptionName]:
    | ((
        f: (t: ToolbarItemType) => ToolbarItemType | undefined,
        t: GenericToolbarItemType<T>
      ) => GenericToolbarItemType<T> | undefined)
    | undefined;
};

const fns: Filters = {
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
  population: undefined,
  radioGroup: undefined,
  range: undefined,
  select: undefined,
  sidebarTabs: withTabs,
  showOnDevice: undefined,
  sidebarTabsButton: undefined,
  slider: undefined,
  stateMode: withOptions,
  switch: undefined,
  tabs: withTabs,
  textarea: undefined,
  textShadow: undefined,
  toggle: undefined,
  typography: undefined,
  transform: undefined,
  savedBlock: undefined,
  globalBlock: undefined,
  formApps: undefined,
  checkGroup: undefined,
  popupCondition: undefined,
  toggleButton: undefined,
  gbCondition: undefined,
  //@ts-expect-error Old option, here should not be "popover" option, it will be removed when all toolbars will work with "popover"
  "legacy-popover": withOptions,
  editableSelect: undefined
};

const getFilter = <T extends OptionName>(
  t: T
):
  | ((
      f: (t: ToolbarItemType) => ToolbarItemType | undefined,
      t: GenericToolbarItemType<T>
    ) => GenericToolbarItemType<T>)
  | undefined =>
  // @ts-expect-error, Need to find a way to filter better options with filters
  fns[t];

export function _filter<T extends ToolbarItemType>(
  f: <T extends ToolbarItemType>(t: T) => boolean,
  t: T
): T | undefined {
  if (!f(t)) {
    return undefined;
  }

  const filter = getFilter(t.type);

  return filter
    ? (filter(
        <T extends ToolbarItemType>(t: T): T | undefined => _filter(f, t),
        t
      ) as T | undefined)
    : t;
}

export function filter<T extends ToolbarItemType>(
  f: <T extends ToolbarItemType>(t: T) => boolean
): (item: T) => T | undefined;
export function filter<T extends ToolbarItemType>(
  f: <T extends ToolbarItemType>(t: T) => boolean,
  item: T
): T | undefined;
export function filter<T extends ToolbarItemType>(
  ...args:
    | [<T extends ToolbarItemType>(t: T) => boolean]
    | [<T extends ToolbarItemType>(t: T) => boolean, T]
): ((t: T) => T | undefined) | T | undefined {
  return args.length === 1
    ? (t) => _filter(args[0], t)
    : _filter(args[0], args[1]);
}
