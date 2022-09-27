import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";

export function cssStyleAnimation({ v, device, state }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const name = dvv("animationName");

  return name ? `animation-name:${name};` : "";
}

export function cssStyleAnimationDuration({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const duration = dvv("animationDuration");

  return duration ? `animation-duration:${duration}ms;` : "";
}

export function cssStyleAnimationDelay({ v, device, state }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const delay = dvv("animationDelay");

  return delay ? `animation-delay:${delay}ms;` : "";
}

export function cssStyleAnimationIterationCount({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const animationInfiniteAnimation = dvv("animationInfiniteAnimation");
  const animation = animationInfiniteAnimation ? "infinite" : "unset";

  return `animation-iteration-count : ${animation};`;
}

export function cssStyleAnimationAll({ v, device, state }: CSSValue): string {
  return `${cssStyleAnimation({
    v,
    device,
    state
  })} ${cssStyleAnimationDuration({
    v,
    device,
    state
  })} ${cssStyleAnimationDelay({
    v,
    device,
    state
  })} ${cssStyleAnimationIterationCount({
    v,
    device,
    state
  })}
  `;
}
