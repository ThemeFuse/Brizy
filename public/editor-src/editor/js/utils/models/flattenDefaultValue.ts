import { Obj } from "@brizy/readers";
import type {
  ElementDefaultValue,
  ElementModel
} from "visual/component/Elements/Types";
import type { Dictionary } from "visual/types/utils";

type FlattenDefaultValueFn = (
  keys: string[]
) => (defaultValue: ElementDefaultValue) => ElementModel;

export const flattenDefaultValue: FlattenDefaultValueFn = (keys) => {
  const keysMap: Dictionary<boolean> = keys.reduce(
    (acc, k) => {
      acc[k] = true;
      return acc;
    },
    {} as Dictionary<boolean>
  );

  return function inner(
    defaultValue: ElementDefaultValue | ElementModel
  ): ElementModel {
    const ret: ElementModel = {};

    for (const [k, v] of Object.entries(defaultValue)) {
      if (keysMap[k] && Obj.isObject(v)) {
        Object.assign(ret, inner(v));
      } else {
        ret[k] = v;
      }
    }

    return ret;
  };
};
