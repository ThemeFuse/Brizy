import { OptionName } from "visual/component/Options/types";
import {
  Map,
  withColumns,
  withOptions,
  withTabs
} from "visual/component/Options/utils/map";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

type Maps = {
  [T in OptionName]: Map<T> | undefined;
};

const fns: Maps = {
  "aiText-dev": undefined,
  "alert-dev": undefined,
  "animation-dev": undefined,
  "backgroundColor-dev": undefined,
  "border-dev": undefined,
  "boxShadow-dev": undefined,
  "button-dev": undefined,
  "codeMirror-dev": undefined,
  "colorPicker-dev": undefined,
  "corners-dev": undefined,
  "fileUpload-dev": undefined,
  "filters-dev": undefined,
  "gallery-dev": undefined,
  "gallery-for-gallery-dev": undefined,
  "grid-dev": withColumns,
  "group-dev": withOptions,
  "iconPicker-dev": undefined,
  "iconsPicker-dev": undefined,
  "iconSetter-dev": undefined,
  "imageUpload-dev": undefined,
  "inputText-dev": undefined,
  "internalLink-dev": undefined,
  "margin-dev": undefined,
  "motion-dev": undefined,
  "multiSelect-dev": undefined,
  "number-dev": undefined,
  "order-dev": undefined,
  "padding-dev": undefined,
  "paypal-dev": undefined,
  "popover-dev": withOptions,
  "population-dev": undefined,
  "radioGroup-dev": undefined,
  "range-dev": undefined,
  "select-dev": undefined,
  "sidebarTabs-dev": withTabs,
  "sidebarTabsButton-dev": undefined,
  "slider-dev": undefined,
  "stateMode-dev": withOptions,
  "switch-dev": undefined,
  "tabs-dev": withTabs,
  "textarea-dev": undefined,
  "textShadow-dev": undefined,
  "toggle-dev": undefined,
  "transform-dev": undefined,
  "typography-dev": undefined,
  "savedBlock-dev": undefined,
  "globalBlock-dev": undefined,
  "formApps-dev": undefined,
  // @ts-expect-error Old option, here should not be "grid" option, it will be removed when all toolbars will work with "grid-dev"
  grid: withColumns,
  // Old option, here should not be "popover" option, it will be removed when all toolbars will work with "popover-dev"
  popover: withOptions
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
