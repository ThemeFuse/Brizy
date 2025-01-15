import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleDisplayNone,
  cssStyleFlexHorizontalAlign,
  cssStylePaddingFourFields,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE } from "visual/utils/stateMode";

// Grid

export function cssStyleElementPostsItemWidth({ v, device, state }) {
  const gridColumn = defaultValueValue({ v, key: "gridColumn", device, state });
  return `width:${gridColumn > 1 ? 100 / gridColumn : 100}%;`;
}

export function cssStyleElementPostsItemSpacing({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  return `padding: ${dvv("padding")}px;`;
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

export function cssStyleElementPostsPaginationFontFamily({
  v,
  device,
  state,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    state,
    store,
    prefix: "pagination",
    renderContext
  });
}

export function cssStyleElementPostsPaginationFontSize({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationLineHeight({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationFontWeight({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationLetterSpacing({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationFontVariation({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationTextTransform({
  v,
  device,
  state,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({ v, device, state, prefix: "paginationColor", store });
}

export function cssStyleElementPostsPaginationBgColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleBgColor({ v, device, state, prefix: "paginationBg", store });
}

export function cssStyleElementPostsPaginationBorder({
  v,
  device,
  state,
  store
}) {
  return cssStyleBorder({ v, device, state, prefix: "pagination", store });
}

export function cssStyleElementPostsPaginationActiveColor({
  v,
  device,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "paginationColor"
  });
}

export function cssStyleElementPostsPaginationActiveBgColor({
  v,
  device,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "paginationBg"
  });
}

export function cssStyleElementPostsPaginationActiveBorder({
  v,
  device,
  store
}) {
  return cssStyleBorder({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "pagination"
  });
}

export function cssStyleElementPostsPaginationBorderRadius({
  v,
  device,
  state,
  store
}) {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    prefix: "pagination"
  });
}

// Tags

export function cssStyleElementPostsFilterDisplay({ v, device, state }) {
  const filter = defaultValueValue({ v, key: "filter", device, state });

  return filter === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementPostsFilterHorizontalAlign({
  v,
  device,
  state,
  store
}) {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
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

export function cssStyleElementPostsFilterFontFamily({
  v,
  device,
  state,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    state,
    store,
    prefix: "filter",
    renderContext
  });
}

export function cssStyleElementPostsFilterFontSize({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterLineHeight({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterFontWeight({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterLetterSpacing({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterFontVariation({
  v,
  device,
  state,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterTextTransform({
  v,
  device,
  state,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterColor({ v, device, state, store }) {
  return cssStyleColor({ v, device, state, store, prefix: "filterColor" });
}

export function cssStyleElementPostsFilterBgColor({ v, device, state, store }) {
  return cssStyleBgColor({ v, device, state, store, prefix: "filterBg" });
}

export function cssStyleElementPostsFilterBorder({ v, device, state, store }) {
  return cssStyleBorder({ v, device, state, store, prefix: "filter" });
}

export function cssStyleElementPostsFilterBorderRadius({
  v,
  device,
  state,
  store
}) {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "filter" });
}

export function cssStyleElementPostsFilterShadow({ v, device, state, store }) {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "filter" });
}

export function cssStyleElementPostsFilterPaddingFourFields({
  v,
  device,
  state,
  store
}) {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementPostsFilterActiveColor({ v, store, device }) {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "filterColor"
  });
}

export function cssStyleElementPostsFilterActiveBgColor({ v, store, device }) {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "filterBg"
  });
}

export function cssStyleElementPostsFilterActiveBorder({ v, store, device }) {
  return cssStyleBorder({ v, device, state: ACTIVE, store, prefix: "filter" });
}

export function cssStyleElementPostsFilterActiveShadow({ v, store, device }) {
  return cssStyleBoxShadow({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "filter"
  });
}
