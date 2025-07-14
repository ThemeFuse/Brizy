import { Str } from "@brizy/readers";
import {
  cssStyleBgColor,
  cssStyleColor,
  cssStyleFlexHorizontalAlign,
  cssStylePaddingFourFields
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import {
  styleAlignHorizontal,
  styleElementTableAside,
  styleElementTableColumns,
  styleElementTableIconPosition,
  styleElementTableIconSpacing,
  styleElementTableWidthType,
  styleSizeHeaderWidth,
  styleSizeWidth
} from "visual/utils/style2";

export function cssStyleElementTableSpacing({ v, device, state }) {
  const iconPosition = styleElementTableIconPosition({ v, device, state });
  const iconSpacing = styleElementTableIconSpacing({ v, device, state });
  return iconPosition === "left"
    ? `margin-inline-end: ${iconSpacing}px;`
    : `margin-inline-start: ${iconSpacing}px;`;
}

export function cssStyleElementTableBtnIconPosition({ v, device, state }) {
  const iconPosition =
    styleElementTableIconPosition({ v, device, state }) === "left"
      ? "row"
      : "row-reverse";
  return `flex-direction: ${iconPosition};`;
}

export function cssStyleElementTableCustomFlexHorizontalAlign({
  v,
  device,
  state
}) {
  const horizontalAlign = styleAlignHorizontal({ v, device, state });

  const iconPosition = styleElementTableIconPosition({ v, device, state });

  if (iconPosition === "left") {
    return cssStyleFlexHorizontalAlign({ v, device, state });
  }

  switch (horizontalAlign) {
    case "center":
      return cssStyleFlexHorizontalAlign({ v, device, state });
    case "left":
      return "justify-content: flex-end;";
    case "right":
      return "justify-content: flex-start;";
  }

  return "";
}

export function cssStyleElementTableAsideWidth({ v, device, state }) {
  const aside = styleElementTableAside({ v, device, state });

  if (aside === "on") {
    const width = styleSizeWidth({ v, device, state, prefix: "aside" });
    const dvv = (key) => defaultValueValue({ v, key, device, state });
    const unit = Str.read(dvv("asideWidthSuffix")) || "px";
    return `min-width: ${width}${unit}; width: ${width}${unit};`;
  }

  return "";
}

export function cssStyleElementTableAsideAutoWidth({ v, device, state }) {
  const widthType = styleElementTableWidthType({ v, device, state });

  if (widthType === "off") {
    const columns = styleElementTableColumns({ v, device, state });
    return `width: calc(100% / ${columns});`;
  }

  return "";
}

export function cssStyleElementTableEvenBgColor({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleBgColor({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix: "bg"
  });
}

export function cssStyleElementTableEvenColor({ v, device, store, getConfig }) {
  return cssStyleColor({ v, device, state: "active", store, getConfig });
}

export function cssStyleTablePadding({ v, device, state, prefix = "table" }) {
  return cssStylePaddingFourFields({ v, device, state, prefix });
}

export function cssStyleElementTableHeaderWidth({ v, device, state }) {
  const width = styleSizeHeaderWidth({ v, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const unit = Str.read(dvv("headerWidthSuffix")) || "px";

  return `width: ${width}${unit}; min-width: ${width}${unit};`;
}
