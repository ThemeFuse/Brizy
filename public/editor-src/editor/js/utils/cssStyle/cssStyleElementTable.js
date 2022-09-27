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
  styleSizeWidth
} from "visual/utils/style2";

export function cssStyleElementTableIconSize({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const iconSize = dvv("iconSize");
  const iconCustomSize = dvv("iconCustomSize");

  switch (iconSize) {
    case "small":
      return "font-size: 16px;";
    case "medium":
      return "font-size: 24px;";
    case "large":
      return "font-size: 32px;";
    case "custom":
      return `font-size: ${iconCustomSize}px;`;
  }
}

export function cssStyleElementTableSpacing({ v, device, state }) {
  const iconPosition = styleElementTableIconPosition({ v, device, state });
  const iconSpacing = styleElementTableIconSpacing({ v, device, state });
  return iconPosition === "left"
    ? `margin: auto ${iconSpacing}px auto 0;`
    : `margin: auto 0 auto ${iconSpacing}px;`;
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
    return `min-width: ${width}px; width: ${width}px`;
  }

  const columns = styleElementTableColumns({ v, device, state });
  return `width: calc(100% / ${columns});`;
}

export function cssStyleElementTableEvenBgColor({ v, device }) {
  return cssStyleBgColor({ v, device, state: "active", prefix: "bg" });
}

export function cssStyleElementTableEvenColor({ v, device }) {
  return cssStyleColor({ v, device, state: "active" });
}

export function cssStyleTablePadding({ v, device, state, prefix = "table" }) {
  return cssStylePaddingFourFields({ v, device, state, prefix });
}
