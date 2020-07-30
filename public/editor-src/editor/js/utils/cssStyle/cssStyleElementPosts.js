import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "visual/utils/onChange";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { styleAlignHorizontal } from "visual/utils/style2";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStylePaddingFourFields } from "visual/utils/cssStyle/cssStylePadding";

// Grid

export function cssStyleElementPostsItemWidth({ v, device, state }) {
  const gridColumn = defaultValueValue({ v, key: "gridColumn", device, state });
  return `width:${gridColumn > 1 ? 100 / gridColumn : 100}%;`;
}

// Pagination

export function cssStyleElementPostsPaginationSpacing({ v, device, state }) {
  const paginationSpacing = defaultValueValue({
    v,
    key: "paginationSpacing",
    device,
    state
  });
  return `margin-top: ${paginationSpacing}px;`;
}

export function cssStyleElementPostsPaginationLinksOff() {
  return "pointer-events: none; cursor: default;";
}

export function cssStyleElementPostsPaginationFontFamily({ v, device, state }) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationFontSize({ v, device, state }) {
  return cssStyleTypography2FontSize({
    v,
    device,
    state,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationLineHeight({ v, device, state }) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationFontWeight({ v, device, state }) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationLetterSpacing({
  v,
  device,
  state
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "paginationColor" });
}

export function cssStyleElementPostsPaginationBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "paginationBg" });
}

export function cssStyleElementPostsPaginationBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "pagination" });
}

export function cssStyleElementPostsPaginationBorderRadius({
  v,
  device,
  state
}) {
  return cssStyleBorderRadius({ v, device, state, prefix: "pagination" });
}

// Tags

export function cssStyleElementPostsFilterDisplay({ v, device, state }) {
  const filter = defaultValueValue({ v, key: "filter", device, state });
  return filter === "off" ? "display:none;" : "display: flex;";
}

export function cssStyleElementPostsFilterHorizontalAlign({
  v,
  device,
  state
}) {
  const horizontalAlign = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "filter"
  });
  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };
  const alignItems =
    horizontalAlign === undefined ? horizontalAlign : aligns[horizontalAlign];

  return `justify-content:${alignItems};`;
}

export function cssStyleElementPostsFilterSpacing({ v, device, state }) {
  const filterSpacing = defaultValueValue({
    v,
    key: "filterSpacing",
    device,
    state
  });
  return `margin: 1px ${filterSpacing}px 0 ${filterSpacing}px;`;
}

export function cssStyleElementPostsFilterAfterSpacing({ v, device, state }) {
  const afterFilterSpacing = defaultValueValue({
    v,
    key: "afterFilterSpacing",
    device,
    state
  });
  return `margin-bottom: ${afterFilterSpacing}px;`;
}

export function cssStyleElementPostsFilterFontFamily({ v, device, state }) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterFontSize({ v, device, state }) {
  return cssStyleTypography2FontSize({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterLineHeight({ v, device, state }) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterFontWeight({ v, device, state }) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterLetterSpacing({ v, device, state }) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "filterColor" });
}

export function cssStyleElementPostsFilterBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "filterBg" });
}

export function cssStyleElementPostsFilterBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "filter" });
}

export function cssStyleElementPostsFilterBorderRadius({ v, device, state }) {
  return cssStyleBorderRadius({ v, device, state, prefix: "filter" });
}

export function cssStyleElementPostsFilterShadow({ v, device, state }) {
  return cssStyleBoxShadow({ v, device, state, prefix: "filter" });
}

export function cssStyleElementPostsFilterPaddingFourFields({
  v,
  device,
  state
}) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "filter" });
}

export function cssStyleElementPostsFilterActiveColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "activeFilterColor" });
}

export function cssStyleElementPostsFilterActiveBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "activeFilterBg" });
}

export function cssStyleElementPostsFilterActiveBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "activeFilter" });
}

export function cssStyleElementPostsFilterActiveShadow({ v, device, state }) {
  return cssStyleBoxShadow({ v, device, state, prefix: "activeFilter" });
}
