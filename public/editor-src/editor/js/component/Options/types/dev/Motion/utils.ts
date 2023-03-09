import { JSXElementConstructor } from "react";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";
import { Blur } from "./components/Blur";
import { Horizontal } from "./components/Horizontal";
import { MouseTrack } from "./components/MouseTrack";
import { Rotate } from "./components/Rotate";
import { Scale } from "./components/Scale";
import { Tilt } from "./components/Tilt";
import { Transparency } from "./components/Transparency";
import { Vertical } from "./components/Vertical";
import { EffectProps } from "./types/EffectProps";
import { Effect, EffectValue } from "./types/Value";

export const effectIcon = (effect: Effect): string => {
  switch (effect) {
    case "blur":
      return "nc-blur";
    case "horizontal":
      return "nc-scroll-horizontal";
    case "mouseTrack":
      return "nc-mouse";
    case "rotate":
      return "nc-captcha";
    case "scale":
      return "nc-scroll-scale";
    case "mouseTilt":
      return "nc-cube";
    case "transparency":
      return "nc-scroll-transparency";
    case "vertical":
      return "nc-scroll-vertical";
  }
};

export const effectTitle = (effect: Effect): string => {
  switch (effect) {
    case "blur":
      return t("Blur");
    case "mouseTrack":
      return t("MouseTrack");
    case "rotate":
      return t("Rotate");
    case "scale":
      return t("Scale");
    case "horizontal":
      return t("Horizontal");
    case "mouseTilt":
      return t("3D Tilt");
    case "transparency":
      return t("Transparency");
    case "vertical":
      return t("Vertical");
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
    case "blur":
      return Blur as T2;
    case "horizontal":
      return Horizontal as T2;
    case "mouseTrack":
      return MouseTrack as T2;
    case "rotate":
      return Rotate as T2;
    case "scale":
      return Scale as T2;
    case "mouseTilt":
      return Tilt as T2;
    case "transparency":
      return Transparency as T2;
    case "vertical":
      return Vertical as T2;
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
