import { CSSValue } from "../style2/types";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";

export function cssStyleStoryProgress({ v }: CSSValue): string {
  const { sliderAutoPlay, sliderAutoPlaySpeed, sliderAutoPlaySpeedSuffix } = v;

  if (sliderAutoPlay === "off") return "";

  const speed = Num.read(sliderAutoPlaySpeed) ?? 0;
  const suffix = Str.read(sliderAutoPlaySpeedSuffix) ?? "px";

  // 0.3 is transition time between slides
  // using +0.3 we avoid the pause at the end of slide
  return `animation:storyProgress ${Number(speed) +
    0.3}${suffix} linear forwards;`;
}

// this func in needed because first slide don't lose time for transition when is not looped
export function cssStyleStoryFristSlideProgress({ v }: CSSValue): string {
  const {
    sliderAutoPlay,
    sliderLoop,
    sliderAutoPlaySpeed,
    sliderAutoPlaySpeedSuffix
  } = v;

  if (sliderAutoPlay === "off" || sliderLoop === "on") return "";

  const speed = Num.read(sliderAutoPlaySpeed) ?? 0;
  const suffix = Str.read(sliderAutoPlaySpeedSuffix) ?? "px";

  return `animation:storyProgress ${speed}${suffix} linear forwards;`;
}
