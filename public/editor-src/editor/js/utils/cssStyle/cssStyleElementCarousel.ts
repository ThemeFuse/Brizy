import { Str } from "@brizy/readers";
import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { styleBgColor, styleBgGradient } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleColor, cssStyleCustomIconColor } from "./cssStyleColor";
import { cssStylePaddingFourFields } from "./cssStylePadding";

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

export function cssStyleElementCarouselArrowSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const size = dvv("arrowSize");
  const customSize = dvv("customArrowSize");
  const customSizeSuffix = Str.read(dvv("customArrowSizeSuffix"));

  switch (size) {
    case "small":
      return "font-size:32px;";
    case "medium":
      return "font-size:48px;";
    case "large":
      return "font-size:64px;";
    case "custom":
      return `font-size:${customSize}${customSizeSuffix};`;
  }

  return "";
}

export function cssStyleElementCarouselColorCustomArrow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleCustomIconColor({
    v,
    device,
    state,
    store,
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

export function cssStyleElementCarouselColorCustomDots({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleCustomIconColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sliderDotsColor"
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

const getTopOffset = (arrowSize: string, customArrowSize: number) => {
  switch (arrowSize) {
    case "small":
      return 20; // 32px font-size
    case "medium":
      return 30; // 48px font-size
    case "large":
      return 40; // 64px font-size
    case "custom":
      return Math.max(20, customArrowSize * 0.6);
    default:
      return 20;
  }
};

// Arrow position styles for style2
export function cssStyleElementCarouselArrowPositionPrev({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const arrowPosition = dvv("arrowPosition");
  const sliderArrowsSpacing = Num.read(dvv("sliderArrowsSpacing")) ?? 0;
  const arrowSize = dvv("arrowSize");
  const customArrowSize = Num.read(dvv("customArrowSize")) ?? 0;

  switch (arrowPosition) {
    case "top-left": {
      const topOffset = getTopOffset(
        Str.read(arrowSize) ?? "",
        customArrowSize
      );
      return `top: ${topOffset}px;`;
    }
    case "top-right": {
      const topOffset = getTopOffset(
        Str.read(arrowSize) ?? "",
        customArrowSize
      );
      return `margin-right: ${sliderArrowsSpacing + 10}px; top: ${topOffset}px;`;
    }
    case "bottom-right":
      return `margin-right: ${sliderArrowsSpacing + 10}px;`;
    case "bottom-middle": {
      const halfSpacing = (sliderArrowsSpacing + 10) / 2;
      return `transform: translateX(-50%) rotate(180deg); margin-left: -${halfSpacing}px;`;
    }
    case "middle-right":
      return `margin-right: ${sliderArrowsSpacing + 10}px;`;
    default:
      return "";
  }
}

export function cssStyleElementCarouselArrowPositionNext({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const arrowPosition = dvv("arrowPosition");
  const sliderArrowsSpacing = Num.read(dvv("sliderArrowsSpacing")) ?? 0;
  const arrowSize = dvv("arrowSize");
  const customArrowSize = Num.read(dvv("customArrowSize")) ?? 0;

  switch (arrowPosition) {
    case "top-left": {
      const topOffset = getTopOffset(
        Str.read(arrowSize) ?? "",
        customArrowSize
      );
      return `margin-left: ${sliderArrowsSpacing + 10}px; top: ${topOffset}px;`;
    }
    case "top-right": {
      const topOffset = getTopOffset(
        Str.read(arrowSize) ?? "",
        customArrowSize
      );
      return `top: ${topOffset}px;`;
    }
    case "bottom-left":
      return `margin-left: ${sliderArrowsSpacing + 10}px;`;
    case "bottom-middle": {
      const halfSpacing = (sliderArrowsSpacing + 10) / 2;
      return `transform: translateX(-50%); margin-left: ${halfSpacing}px;`;
    }
    case "middle-left":
      return `margin-left: ${sliderArrowsSpacing + 10}px;`;
    default:
      return "";
  }
}

export function cssStyleElementCarouselNavigationBgPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "navigationBg"
  });
}

export function cssStyleElementCarouselBgColorNavigation({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  const bgColor = styleBgColor({
    v,
    device,
    state,
    getConfig,
    prefix: "navigationBg"
  });

  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "navigation"
  });

  return bgColor === undefined || bgGradient !== "none"
    ? "background-color:transparent;"
    : `background-color:${bgColor};`;
}

export function cssStyleElementCarouselBgGradientNavigation({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  const gradient = styleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "navigation"
  });

  return gradient !== "none" ? `background-image:${gradient};` : "";
}
