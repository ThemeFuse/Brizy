import { JSXElementConstructor } from "react";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";
import { Rotate } from "./components/Rotate";
import { EffectProps } from "./types/EffectProps";
import { Effect, EffectValue } from "./types/Value";

export const effectIcon = (effect: Effect): string => {
  switch (effect) {
    case "rotate":
      return "nc-captcha";
  }
};

export const effectTitle = (effect: Effect): string => {
  switch (effect) {
    case "rotate":
      return t("Rotate");
  }
};

export function effectOptions<T extends Effect>(
  e: T
): JSXElementConstructor<EffectProps<EffectValue<T>>>;
export function effectOptions(
  e: Effect
): JSXElementConstructor<EffectProps<EffectValue<Effect>>> {
  type T2 = JSXElementConstructor<EffectProps<EffectValue<Effect>>>;
  switch (e) {
    case "rotate":
      return Rotate as T2;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordType<T extends Record<any, any>> = T extends Record<any, infer V>
  ? V
  : never;

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
  v: Record<string, Record<string, unknown>>
): Record<string, unknown> => {
  const acc: Record<string, Primitive> = {};
  for (const k in v) {
    if (Object.prototype.hasOwnProperty.call(v, k)) {
      Object.assign(acc, prefixKeys(k, v[k]));
    }
  }

  return acc;
};

export const isEnabled = (get: FromElementModelGetter): boolean =>
  !!get("enabled");
