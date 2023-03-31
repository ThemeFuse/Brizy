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
  "typography-dev": undefined,
  "transform-dev": undefined,
  "savedBlock-dev": undefined,
  "globalBlock-dev": undefined,
  "formApps-dev": undefined
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
