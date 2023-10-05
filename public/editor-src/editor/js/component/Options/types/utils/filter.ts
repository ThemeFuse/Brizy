import { OptionName } from "visual/component/Options/types";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { withColumns, withOptions, withTabs } from "../../utils/filters";

type Filters = {
  [T in OptionName]:
    | ((
        f: (t: ToolbarItemType) => ToolbarItemType | undefined,
        t: GenericToolbarItemType<T>
      ) => GenericToolbarItemType<T> | undefined)
    | undefined;
};

const fns: Filters = {
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
  "formApps-dev": undefined,
  // @ts-expect-error Old option, here should not be "tabs" option, it will be removed when all toolbars will work with "tabs-dev"
  tabs: withTabs,
  // Old option, here should not be "grid" option, it will be removed when all toolbars will work with "grid-dev"
  grid: withColumns,
  // Old option, here should not be "popover" option, it will be removed when all toolbars will work with "popover-dev"
  popover: withOptions,
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
