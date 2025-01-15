import { Obj } from "@brizy/readers";
import { capByPrefix } from "visual/utils/string";
import { MValue } from "visual/utils/value";

export enum Type {
  active = "active",
  enable = "enable",
  effect = "effect",
  multiple = "multiple"
}

interface Value extends Record<string, unknown> {
  type?: Type;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordType<T extends Record<any, any>> = T extends Record<any, infer V> ? V : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prefixKeys = <T extends Record<any, any>>(
  prefix: string,
  v: T
): Record<string, RecordType<T>> => {
  const acc: Record<string, RecordType<T>> = {};

  for (const k in v) {
    if (Object.prototype.hasOwnProperty.call(v, k)) {
      acc[capByPrefix(prefix, k)] = v[k];
    }
  }

  return acc;
};

export const flattenObject = (
  v: Record<string, Record<string, unknown> | unknown>
): Record<string, unknown> => {
  const acc: Record<string, unknown> = {};

  for (const k in v) {
    if (Object.prototype.hasOwnProperty.call(v, k)) {
      const value = v[k];
      if (Obj.isObject(value)) {
        if (!Obj.length(value)) {
          acc[k] = {}; // Assign an empty object if the value is an empty object.
        } else {
          // Recursively flatten the nested object.
          const nestedFlattened = flattenObject(value);
          Object.assign(acc, prefixKeys(k, nestedFlattened));
        }
      } else {
        // If the value is not an object, add it directly to `acc`.
        acc[k] = v[k];
      }
    }
  }
  return acc;
};

export const hasEffect = (
  patch: Record<string, unknown>,
  effects: Record<string, unknown>
) => {
  for (const [key, value] of Object.entries(patch)) {
    if (
      effects.hasOwnProperty(key) &&
      Obj.isObject(value) &&
      Obj.length(value)
    ) {
      return true;
    }
  }
  return false;
};

export const hasActive = (patch: Record<string, unknown>) => !!patch.active;

export const getPatchType = (
  patch: Value,
  effects: Record<string, unknown>
): MValue<Type> => {
  if (patch.type) {
    return patch.type;
  }

  const hasActiveType = hasActive(patch);
  const hasEffectType = hasEffect(patch, effects);

  if (hasActiveType && hasEffectType) {
    return Type.multiple;
  }

  if (hasActiveType) {
    return Type.active;
  }

  if (hasEffectType) {
    return Type.effect;
  }
};

export const getEnabledEffects = (
  patch: Record<string, unknown>
): Record<string, boolean> =>
  Object.entries(patch).reduce((acc, [key, value]) => {
    // here is enough to check if the value is an object, because if the effect is not enabled, the value will be undefined
    if (Obj.isObject(value) && Obj.length(value)) {
      return {
        ...acc,
        [capByPrefix(key, "enabled")]: true
      };
    }
    return acc;
  }, {});

export const flattEffects = (
  patch: Record<string, unknown>,
  effects: Record<string, unknown>
) => {
  let newPatch = {};

  for (const [key, value] of Object.entries(patch)) {
    if (
      effects.hasOwnProperty(key) &&
      Obj.isObject(value) &&
      Obj.length(value)
    ) {
      newPatch = {
        ...newPatch,
        ...flattenObject({
          [key]: value
        })
      };
    }
  }

  return newPatch;
};
