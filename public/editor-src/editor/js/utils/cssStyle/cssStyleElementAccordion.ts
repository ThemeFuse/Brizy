import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStylePaddingFourFields,
  cssStyleSizeFontSizeIcon,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import {
  styleAlignHorizontal,
  styleBorderWidthUngrouped
} from "visual/utils/style2";
import {
  styleElementAccordionFilterAfterSpacing,
  styleElementAccordionFilterSpacing,
  styleElementAccordionSpacing
} from "visual/utils/style2/styleElementAccordion";
import { CSSValue } from "../style2/types";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";

export function cssStyleElementAccordionFilterColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "filterColor" });
}

export function cssStyleElementAccordionFilterActiveColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix: "filterColor" });
}

export function cssStyleElementAccordionFilterActiveBgColor({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix: "filterBg" });
}

export function cssStyleElementAccordionFilterActiveBorder({
  v,
  device
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementAccordionFilterActiveShadow({
  v,
  device
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementAccordionFilterBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "filterBg" });
}

export function cssStyleElementAccordionFilterBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionFilterBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionFilterShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionMarginTop({
  v,
  device,
  state
}: CSSValue): string {
  return `margin-top: -${styleBorderWidthUngrouped({ v, device, state })}px `;
}

export function cssStyleElementAccordionSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `margin-bottom: ${styleElementAccordionSpacing({
    v,
    device,
    state
  })}px `;
}

export function cssStyleElementAccordionFilterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const filterSpacing = styleElementAccordionFilterSpacing({
    v,
    device,
    state
  });
  return `margin: 1px ${filterSpacing}px 0 ${filterSpacing}px;`;
}

export function cssStyleElementAccordionFilterAfterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `margin-bottom:${styleElementAccordionFilterAfterSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleElementAccordionNavAlign({
  v,
  device,
  state
}: CSSValue): string {
  const horizontalAlign = styleAlignHorizontal({ v, device, state });

  return horizontalAlign === "right"
    ? "flex-direction: row-reverse;"
    : horizontalAlign === "center"
    ? "justify-content: center;"
    : "";
}

export function cssStyleElementAccordionNavIconSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const horizontalAlign = styleAlignHorizontal({ v, device, state });

  return horizontalAlign === "right"
    ? "margin: 0 10px 0 0;"
    : "margin: 0 0 0 10px;";
}

export function cssStyleElementAccordionNavIconSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeFontSizeIcon({ v, device, state, prefix: "nav" });
}

export function cssStyleElementAccordionFilterHorizontalAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionFilterPaddingFourFields({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordion3FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementAccordion3FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionFilterTextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionActiveColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix: "color" });
}

export function cssStyleElementAccordionActiveBgColor({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix: "bg" });
}

export function cssStyleElementAccordionActiveBorder({
  v,
  device
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active" });
}

export function cssStyleElementAccordionActiveShadow({
  v,
  device
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active" });
}

export function cssStyleElementAccordionAnimDuration({ v }: CSSValue): string {
  return `transition: height ${v.animDuration}s ease-out;`;
}

export function cssStyleElementAccordionTitlePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "title" });
}
