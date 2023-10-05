import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleMaskCustomShape,
  cssStyleMaskPosition,
  cssStyleMaskRepeat,
  cssStyleMaskShape,
  cssStyleMaskSize,
  cssStylePaddingFourFields,
  cssStyleSizeMinWidth,
  cssStyleSizeWidth,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { cssStyleBorderRadius } from "visual/utils/cssStyle";
import { cssStyleBgGradient } from "visual/utils/cssStyle";
import { cssStyleSpacing } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { CSSValue } from "../style2/types";

export function cssStyleElementImageGalleryWidth({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const layout = dvv("layout");
  const thumbStyle = dvv("thumbStyle");
  const columnNumber = dvv("gridColumn");
  const spacing = dvv("spacing");

  if (
    layout === "bigImage" &&
    (thumbStyle === "left" || thumbStyle === "right")
  ) {
    const minWidth = cssStyleSizeMinWidth({
      v,
      device,
      state,
      prefix: "thumb"
    });
    const width = cssStyleSizeWidth({
      v,
      device,
      state,
      prefix: "thumb"
    });

    return `${minWidth}${width}`;
  }

  if (layout === "grid" && columnNumber === 1) {
    return "width:100%;";
  }

  return `width:calc(100% + ${spacing}px);`;
}

export function cssStyleElementImageGalleryMargin({
  v,
  device,
  state
}: CSSValue): string {
  const { layout, thumbStyle } = v;

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const spacing = Num.read(dvv("spacing")) ?? 0;

  const isHorizontal = thumbStyle === "left" || thumbStyle === "right";
  if (layout === "bigImage" && isHorizontal) {
    return "margin:initial;";
  }

  return `margin:-${spacing / 2}px;`;
}

export function cssStyleElementImageGalleryItemWidth({
  v,
  device,
  state
}: CSSValue): string {
  const { layout } = v;

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const columnNumber = Num.read(dvv("gridColumn")) ?? 1;
  const spacing = dvv("spacing");

  if (layout === "bigImage") {
    return `width:${columnNumber ? 100 / columnNumber : 100}%;`;
  }

  if (layout === "grid") {
    const columnSize = 100 / columnNumber;
    const _columnSize =
      columnNumber === 1
        ? `${columnSize}%`
        : `calc(${columnSize}% - ${spacing}px)`;

    return `width:${_columnSize};`;
  }

  return `width:${columnNumber > 1 ? 100 / columnNumber : 100}%;`;
}

export function cssStyleElementImageGalleryItemPadding({
  v,
  device
}: CSSValue): string {
  const { layout, thumbStyle } = v;

  const spacing = defaultValueValue({ v, key: "spacing", device });

  const isHorizontal = thumbStyle === "left" || thumbStyle === "right";

  if (layout === "grid") {
    return "padding: 0px;";
  }

  if (layout === "bigImage" && isHorizontal) {
    return `padding:0 0 ${spacing}px 0;`;
  }

  return `padding:${spacing / 2}px;`;
}

export const cssStyleElementImageGalleryGridItemsSpacing = ({
  v,
  device,
  state
}: CSSValue) => {
  const { layout } = v;

  if (layout !== "grid") {
    return "";
  }

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const spacing = Num.read(dvv("spacing")) ?? 0;

  return `row-gap:${spacing}px; column-gap:${spacing}px; margin:0;`;
};

export function cssStyleElementImageGalleryFilterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const filterSpacing = dvv("filterSpacing");
  return `margin: 1px ${filterSpacing}px 0 ${filterSpacing}px;`;
}

export function cssStyleElementImageGalleryFilterAfterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const afterFilterSpacing = dvv("afterFilterSpacing");
  return `margin-bottom:${afterFilterSpacing}px;`;
}

export function cssStyleElementImageGalleryFilterHorizontalAlign({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const filterStyle = dvv("filterStyle");
  const horizontalAlign = dvv("filterHorizontalAlign");

  switch (filterStyle) {
    case "style-2": {
      if (horizontalAlign === "center") {
        return "";
      }

      if (horizontalAlign === "left") {
        return "margin-right: auto;";
      }

      return "margin-left: auto;";
    }
    default: {
      if (horizontalAlign === undefined) {
        return "";
      }

      const aligns: Record<string, string> = {
        left: "flex-start",
        center: "center",
        right: "flex-end"
      };

      return `justify-content:${aligns[`${horizontalAlign}`]};`;
    }
  }
}

export function cssStyleElementImageGalleryPaddingFourFields({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "filterColor" });
}

export function cssStyleElementImageGalleryFilterBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "filterBg" });
}

export function cssStyleElementImageGalleryFilterBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGalleryBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGallery3FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3LetterSpacing({
  v,
  state,
  device
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    state,
    device,
    prefix: "filter"
  });
}

export function cssStyleElementImageGalleryFilterActiveColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix: "filterColor" });
}

export function cssStyleElementImageGalleryFilterActiveBgColor({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix: "filterBg" });
}

export function cssStyleElementImageGalleryFilterActiveBorder({
  v,
  device
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterActiveShadow({
  v,
  device
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementImageGalleryGridAspectRatio({
  v
}: CSSValue): string {
  const { layout, gridAspectRatio } = v;

  return layout === "grid" && gridAspectRatio
    ? `aspect-ratio:${gridAspectRatio};`
    : "";
}

export function cssStyleElementImageGalleryImagesBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "galleryImage" });
}

export function cssStyleElementImageGalleryBigImageSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const thumbStyle = Str.read(v.thumbStyle) ?? "";

  if (!thumbStyle) return "";

  return cssStyleSpacing({
    v,
    device,
    state,
    direction: thumbStyle,
    prefix: "bigImage"
  });
}

export function cssStyleElementImageGalleryBigImageStyle({
  v
}: CSSValue): string {
  const { layout, thumbStyle } = v;

  if (!thumbStyle) return "";

  if (layout === "bigImage") {
    switch (thumbStyle) {
      case "bottom":
        return "flex-direction: column";
      case "top":
        return "flex-direction: column-reverse;";
      case "right":
        return "flex-direction: row;";
      case "left":
        return "flex-direction: row-reverse;";
    }
  }

  return "";
}

export function cssStyleElementImageGalleryWrapperWidth({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbWidth = dvv("thumbWidth");

  return `max-width:${thumbWidth}px;`;
}

export function cssStyleElementImageGalleryBigImageBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "bigImage" });
}

export function cssStyleElementImageGalleryBigImageBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "bigImage" });
}

export function cssStyleElementImageGalleryBigImageWidth({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const bigImageWidth = dvv("bigImageWidth");
  const bigImageWidthSuffix = dvv("bigImageWidthSuffix");

  return `width:${bigImageWidth}${bigImageWidthSuffix};`;
}

export function cssStyleElementImageGalleryImagesBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "galleryImage" });
}

export function cssStyleElementImageGalleryBorderRadiusThumbnail({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "thumbnail" });
}

export function cssStyleElementImageGalleryImagesOverlay({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "galleryImageOverlayBg" });
}

export function cssStyleElementImageGalleryImagesGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "galleryImageOverlay"
  });
}

export function cssStyleElementImageGalleryBigImageImagesMaskShape({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMaskShape({ v, device, state, prefix: "images" });
}

export function cssStyleElementImageGalleryBigImageImagesMaskSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMaskSize({ v, device, state, prefix: "images" });
}

export function cssStyleElementImageGalleryBigImageImagesMaskRepeat({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMaskRepeat({ v, device, state, prefix: "images" });
}

export function cssStyleElementImageGalleryBigImageImagesMaskPosition({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMaskPosition({ v, device, state, prefix: "images" });
}

export function cssStyleElementImageGalleryBigImageOverlay({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "bigImageOverlayBg" });
}

export function cssStyleElementImageGalleryBigImageImagesCustomMask({
  v,
  device,
  state
}: CSSValue) {
  return cssStyleMaskCustomShape({ v, device, state, prefix: "images" });
}
