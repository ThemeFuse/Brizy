import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { isNullish } from "visual/utils/value";
import { capByPrefix } from "../string";
import { CSSValue } from "../style2/types";

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
  })} ${cssStyleAnimationIterationCount({
    v,
    device,
    store,
    state,
    getConfig
  })}
  `;
}
