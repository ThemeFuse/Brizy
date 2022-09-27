import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStylePaddingFourFields,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { defaultValueValue } from "visual/utils/onChange";
import {
  styleAlignHorizontal,
  styleElementImageGalleryFilterStyle,
  styleElementImageGalleryGridColumn,
  styleElementImageGallerySpacing
} from "visual/utils/style2";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";

export function cssStyleElementImageGalleryWidth({ v, device, state }) {
  const spacing = styleElementImageGallerySpacing({
    v,
    device,
    state
  });

  return `width:calc(100% + ${spacing}px);`;
}

export function cssStyleElementImageGalleryMargin({ v, device, state }) {
  const spacing = styleElementImageGallerySpacing({
    v,
    device,
    state
  });

  return `margin:-${spacing / 2}px;`;
}

export function cssStyleElementImageGalleryItemWidth({ v, device, state }) {
  const gridColumn = styleElementImageGalleryGridColumn({ v, device, state });

  return `width:${gridColumn > 1 ? 100 / gridColumn : 100}%;`;
}

export function cssStyleElementImageGalleryItemPadding({ v, device, state }) {
  const spacing = styleElementImageGallerySpacing({
    v,
    device,
    state
  });

  return `padding:${spacing / 2}px;`;
}

export function cssStyleElementImageGalleryFilterSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const filterSpacing = dvv("filterSpacing");
  return `margin: 1px ${filterSpacing}px 0 ${filterSpacing}px;`;
}

export function cssStyleElementImageGalleryFilterAfterSpacing({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const afterFilterSpacing = dvv("afterFilterSpacing");
  return `margin-bottom:${afterFilterSpacing}px;`;
}

export function cssStyleElementImageGalleryFilterHorizontalAlign({
  v,
  device,
  state,
  prefix = "filter"
}) {
  const filterStyle = styleElementImageGalleryFilterStyle({ v, device, state });
  const horizontalAlign = styleAlignHorizontal({ v, device, state, prefix });

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
      return cssStyleFlexHorizontalAlign({ v, device, state, prefix });
    }
  }
}

export function cssStyleElementImageGalleryPaddingFourFields({
  v,
  device,
  state
}) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "filterColor" });
}

export function cssStyleElementImageGalleryFilterBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "filterBg" });
}

export function cssStyleElementImageGalleryFilterBoxShadow({
  v,
  device,
  state
}) {
  return cssStyleBoxShadow({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGalleryBorderRadius({ v, device, state }) {
  return cssStyleBorderRadius({ v, device, state, prefix: "filter" });
}

export function cssStyleElementImageGallery3FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGallery3LetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterActiveColor({ v, device }) {
  return cssStyleColor({ v, device, state: "active", prefix: "filterColor" });
}

export function cssStyleElementImageGalleryFilterActiveBgColor({ v, device }) {
  return cssStyleBgColor({ v, device, state: "active", prefix: "filterBg" });
}

export function cssStyleElementImageGalleryFilterActiveBorder({ v, device }) {
  return cssStyleBorder({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementImageGalleryFilterActiveShadow({ v, device }) {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementImageGalleryPropertyHoverTransition() {
  return "transition-property: color, background, border-color, box-shadow;";
}
