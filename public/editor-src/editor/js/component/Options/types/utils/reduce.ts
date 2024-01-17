import { OptionName } from "visual/component/Options/types";
import {
  Reduce,
  withColumns,
  withOptions,
  withTabs
} from "visual/component/Options/utils/reduce";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";

type Reducers = {
  [K in OptionName]:
    | (<T>(
        fn: (acc: T, item: ToolbarItemType) => T,
        t0: T,
        item: GenericToolbarItemType<K>
      ) => T)
    | undefined;
};

const fns: Reducers = {
  "aiText-dev": undefined,
  alert: undefined,
  animation: undefined,
  backgroundColor: undefined,
  border: undefined,
  boxShadow: undefined,
  "button-dev": undefined,
  "codeMirror-dev": undefined,
  colorPicker: undefined,
  corners: undefined,
  fileUpload: undefined,
  "filters-dev": undefined,
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
  "number-dev": undefined,
  "order-dev": undefined,
  padding: undefined,
  "paypal-dev": undefined,
  popover: withOptions,
  "population-dev": undefined,
  radioGroup: undefined,
  range: undefined,
  select: undefined,
  sidebarTabs: withTabs,
  sidebarTabsButton: undefined,
  slider: undefined,
  "stateMode-dev": withOptions,
  switch: undefined,
  tabs: withTabs,
  textarea: undefined,
  textShadow: undefined,
  toggle: undefined,
  typography: undefined,
  transform: undefined,
  "savedBlock-dev": undefined,
  globalBlock: undefined,
  formApps: undefined,
  // @ts-expect-error Old option, here should not be "grid" option, it will be removed when all toolbars will work with "grid-dev"
  "legacy-grid": withColumns,
  // Old option, here should not be "popover" option, it will be removed when all toolbars will work with "popover"
  "legacy-popover": withOptions
};

export function reduce<T>(
  f: (acc: T, i: ToolbarItemType) => T,
  t0: T,
  i: ToolbarItemType
): T {
  const reducer = fns[i.type] as Reduce<OptionName> | undefined;

  return reducer
    ? reducer((acc, i) => reduce(f, acc, i), f(t0, i), i)
    : f(t0, i);
}

/**
 * Reduce Right, reduces the options tree from inside out
 */
export function reduceR<T>(
  f: (acc: T, i: ToolbarItemType) => T,
  t0: T,
  i: ToolbarItemType
): T {
  const reducer = fns[i.type] as Reduce<OptionName> | undefined;

  return reducer
    ? f(
        reducer((acc, i) => reduceR(f, acc, i), t0, i),
        i
      )
    : f(t0, i);
}
