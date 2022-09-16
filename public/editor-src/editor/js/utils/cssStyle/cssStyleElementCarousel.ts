import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { stylePaddingUngrouped } from "../style2/stylePadding";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

export function cssStyleElementCarouselColorDots({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "sliderDotsColor"
  });
}

export function cssStyleElementCarouselColorArrow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "sliderArrowsColor"
  });
}

export function cssStyleElementCarouselPaddingLeftRight({
  v,
  device,
  state
}: CSSValue): string {
  return `padding-left: ${stylePaddingUngrouped({
    v,
    device,
    state,
    prefix: "slider",
    current: "paddingLeft"
  })}px; 
  padding-right: ${stylePaddingUngrouped({
    v,
    device,
    state,
    prefix: "slider",
    current: "paddingRight"
  })}px;`;
}

export function cssStyleElementCarouselMarginPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const sliderMargin = Num.read(dvv("sliderMargin")) ?? 0;

  return `padding-top: ${stylePaddingUngrouped({
    v,
    device,
    state,
    prefix: "slider",
    current: "paddingTop"
  })}px; 
  padding-bottom: ${stylePaddingUngrouped({
    v,
    device,
    state,
    prefix: "slider",
    current: "paddingBottom"
  })}px;
  margin-left:${sliderMargin}px;
  margin-right:${sliderMargin}px;`;
}

export function cssStyleElementCarouselSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const spacing = dvv("spacing");

  return `padding-left: calc(${spacing}px / 2); padding-right: calc(${spacing}px / 2);`;
}

export function cssStyleElementCarouselPrev({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const sliderArrowsSpacing = dvv("sliderArrowsSpacing");

  return `left: ${sliderArrowsSpacing}px;`;
}

export function cssStyleElementCarouselNext({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const sliderArrowsSpacing = dvv("sliderArrowsSpacing");

  return `right: ${sliderArrowsSpacing}px;`;
}
