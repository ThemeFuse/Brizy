import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import types, { OptionName } from "visual/component/Options/types";

const getFilter = <T extends OptionName>(
  t: T
):
  | ((
      f: (t: ToolbarItemType) => ToolbarItemType | undefined,
      t: GenericToolbarItemType<T>
    ) => GenericToolbarItemType<T>)
  | undefined =>
  // @ts-expect-error, Need to find a way to filter better options with filters
  types[t]?.filter;

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
    ? t => _filter(args[0], t)
    : _filter(args[0], args[1]);
}
