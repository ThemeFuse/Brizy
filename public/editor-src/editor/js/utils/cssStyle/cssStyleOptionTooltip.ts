import { WithRenderContext } from "visual/providers/RenderProvider";
import { cssStyleTextAlign } from "visual/utils/cssStyle/cssStyleAlign";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBgGradient } from "visual/utils/cssStyle/cssStyleBgGradient";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStylePaddingFourFields } from "visual/utils/cssStyle/cssStylePadding";
import { getAllCssStyleTypography } from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleOptionTooltipWidth({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const tooltipWidth = dvv("tooltipWidth");
  const tooltipWidthSuffix = dvv("tooltipWidthSuffix");

  if (tooltipWidth) {
    return `width: ${tooltipWidth}${tooltipWidthSuffix};`;
  }

  return "";
}

export function cssStyleOptionTooltipBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltipBg"
  });
}

export function cssStyleOptionTooltipArrowTopColor({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "tooltipBgColor"
  });

  return color ? `border-top-color: ${color};` : "";
}

export function cssStyleOptionTooltipArrowBottomColor({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "tooltipBgColor"
  });

  return color ? `border-bottom-color: ${color};` : "";
}

export function cssStyleOptionTooltipArrowLeftColor({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "tooltipBgColor"
  });

  return color ? `border-left-color: ${color};` : "";
}

export function cssStyleOptionTooltipArrowRightColor({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "tooltipBgColor"
  });

  return color ? `border-right-color: ${color};` : "";
}

export function cssStyleOptionTooltipBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltip"
  });
}

export function cssStyleOptionTooltipColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltipTextColor"
  });
}

export function cssStyleOptionTooltipBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltip"
  });
}

export function cssStyleOptionTooltipShadow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltip"
  });
}

export function cssStyleOptionTooltipTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltipTypography",
    renderContext
  });
}

export function cssStyleOptionTooltipHorizontalAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltip"
  });
}

export function cssStyleOptionTooltipBorderRadius({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tooltip"
  });
}

export function cssStyleOptionTooltipPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "tooltip"
  });
}
