import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

export function cssStyleElementCarouselColorDots({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "sliderDotsColor"
  });
}

export function cssStyleElementCarouselColorArrow({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "sliderArrowsColor"
  });
}

export function cssStyleElementCarouselColorPause({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "sliderPauseColor"
  });
}

export function cssStyleElementCarouselPaddingLeftRight({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const paddingRight = Num.read(dvv("sliderPaddingRight")) ?? 70;
  const paddingRightSuffix = dvv("sliderPaddingRightSuffix");
  const paddingLeft = Num.read(dvv("sliderPaddingLeft")) ?? 70;
  const paddingLeftSuffix = dvv("sliderPaddingLeftSuffix");

  return `padding-right: ${paddingRight}${paddingRightSuffix}; padding-left: ${paddingLeft}${paddingLeftSuffix};`;
}

export function cssStyleElementCarouselMarginPadding({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const sliderMargin = Num.read(dvv("sliderMargin")) ?? 0;
  const sliderMarginSuffix = dvv("sliderMarginSuffix") ?? "px";
  const paddingTop = Num.read(dvv("sliderPaddingTop")) ?? 10;
  const paddingBottom = Num.read(dvv("sliderPaddingBottom")) ?? 30;
  const paddingTopSuffix = dvv("sliderPaddingTopSuffix");
  const paddingBottomSuffix = dvv("sliderPaddingBottomSuffix");

  return `padding-top: ${paddingTop}${paddingTopSuffix};
          padding-bottom: ${paddingBottom}${paddingBottomSuffix};
          margin-left:${sliderMargin}${sliderMarginSuffix};
          margin-right:${sliderMargin}${sliderMarginSuffix};`;
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
