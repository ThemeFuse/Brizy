import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/string/specs";
import { isNullish } from "visual/utils/value";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

const VALID_TIMING = [
  "ease",
  "ease-fast",
  "ease-slow",
  "ease-in",
  "ease-in-fast",
  "ease-in-slow",
  "ease-out",
  "ease-out-fast",
  "ease-out-slow",
  "ease-in-out",
  "ease-in-out-fast",
  "ease-in-out-slow",
  "linear"
];

// Bezier curves for fast/slow timing variants
const TIMING_TO_CSS: Record<string, string> = {
  // Standard CSS timing functions
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
  // Fast variants - more aggressive acceleration/deceleration
  "ease-fast": "cubic-bezier(0.4, 0, 0.2, 1)",
  "ease-in-fast": "cubic-bezier(0.55, 0, 1, 1)",
  "ease-out-fast": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out-fast": "cubic-bezier(0.4, 0, 0.2, 1)",
  // Slow variants - gentler, more gradual transitions
  "ease-slow": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "ease-in-slow": "cubic-bezier(0.32, 0, 0.67, 0)",
  "ease-out-slow": "cubic-bezier(0.33, 1, 0.68, 1)",
  "ease-in-out-slow": "cubic-bezier(0.37, 0, 0.63, 1)"
};

export function cssStyleAnimation({
  v,
  device,
  state,
  prefix = "animation"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const name = dvv(capByPrefix(prefix, "name"));

  if (isNullish(name)) {
    return "";
  }

  return name ? `animation-name:${name};` : "";
}

export function cssStyleAnimationTimingFunction({
  v,
  device,
  state,
  prefix = "animation"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const name = Str.read(dvv(capByPrefix(prefix, "name")));
  const timing = Str.read(dvv(capByPrefix(prefix, "timing")));

  // Only output timing function for reveal animations
  if (
    isNullish(name) ||
    !name.startsWith("brz-reveal-") ||
    isNullish(timing) ||
    !VALID_TIMING.includes(timing)
  ) {
    return "";
  }

  const cssValue = TIMING_TO_CSS[timing] ?? timing;
  return `animation-timing-function:${cssValue};`;
}

export function cssStyleAnimationDuration({
  v,
  device,
  state,
  prefix = "animation"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const duration = dvv(capByPrefix(prefix, "duration"));

  if (isNullish(duration)) {
    return "";
  }

  return Num.read(duration) !== undefined
    ? `animation-duration:${duration}ms;`
    : "";
}

export function cssStyleAnimationDelay({
  v,
  device,
  state,
  prefix = "animation"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const delay = dvv(capByPrefix(prefix, "delay"));

  if (isNullish(delay)) {
    return "";
  }

  return Num.read(delay) !== undefined ? `animation-delay:${delay}ms;` : "";
}

export function cssStyleAnimationIterationCount({
  v,
  device,
  state,
  prefix = "animation"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const animationInfiniteAnimation = dvv(
    capByPrefix(prefix, "infiniteAnimation")
  );
  const animation = animationInfiniteAnimation ? "infinite" : "unset";

  return `animation-iteration-count : ${animation};`;
}

export function cssStyleAnimationAll({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return `${cssStyleAnimation({
    v,
    device,
    store,
    state,
    getConfig
  })} ${cssStyleAnimationDuration({
    v,
    device,
    store,
    state,
    getConfig
  })} ${cssStyleAnimationDelay({
    v,
    device,
    store,
    state,
    getConfig
  })} ${cssStyleAnimationTimingFunction({
    v,
    device,
    store,
    state,
    getConfig
  })} ${cssStyleAnimationIterationCount({
    v,
    device,
    store,
    state,
    getConfig
  })}
  `;
}
