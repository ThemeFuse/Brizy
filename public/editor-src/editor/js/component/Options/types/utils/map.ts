import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import types, { OptionName } from "visual/component/Options/types";

const getMap = <T extends OptionName>(
  t: T
): ((
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: GenericToolbarItemType<T>
) => ToolbarItemType) =>
  // @ts-expect-error, Need to find a way to filter better options with map
  types[t]?.map;

export function _map(
  f: (t: ToolbarItemType) => ToolbarItemType,
  t: ToolbarItemType
): ToolbarItemType {
  const map = getMap(t.type);
  const mapped = f(t);

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
  return args.length === 1 ? t => _map(args[0], t) : _map(args[0], args[1]);
}
