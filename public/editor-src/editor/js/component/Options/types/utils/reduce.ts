import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import types, { OptionName } from "visual/component/Options/types";

type Reducer = <T>(
  fn: (acc: T, item: ToolbarItemType) => T,
  t0: T,
  item: ToolbarItemType
) => T;

const getReducer = <Type extends OptionName>(t: Type): Reducer | undefined =>
  // @ts-expect-error, Need to find a way to filter better options with filters
  types[t]?.reduce;

export function reduce<T>(
  f: (acc: T, i: ToolbarItemType) => T,
  t0: T,
  i: ToolbarItemType
): T {
  const reducer = getReducer(i.type);

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
  const reducer = getReducer(i.type);

  return reducer
    ? f(
        reducer((acc, i) => reduceR(f, acc, i), t0, i),
        i
      )
    : f(t0, i);
}
