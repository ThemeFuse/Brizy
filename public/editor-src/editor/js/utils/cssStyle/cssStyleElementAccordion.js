import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStylePaddingFourFields,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import {
  styleAlignHorizontal,
  styleBorderWidthUngrouped,
  styleTypography2FontSize
} from "visual/utils/style2";
import {
  styleElementAccordionFilterAfterSpacing,
  styleElementAccordionFilterSpacing,
  styleElementAccordionSpacing
} from "visual/utils/style2/styleElementAccordion";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";

export function cssStyleElementAccordionFilterColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "filterColor" });
}

export function cssStyleElementAccordionFilterActiveColor({ v, device }) {
  return cssStyleColor({ v, device, state: "active", prefix: "filterColor" });
}

export function cssStyleElementAccordionFilterActiveBgColor({ v, device }) {
  return cssStyleBgColor({ v, device, state: "active", prefix: "filterBg" });
}

export function cssStyleElementAccordionFilterActiveBorder({ v, device }) {
  return cssStyleBorder({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementAccordionFilterActiveShadow({ v, device }) {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "filter" });
}

export function cssStyleElementAccordionFilterBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "filterBg" });
}

export function cssStyleElementAccordionFilterBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionFilterBorderRadius({
  v,
  device,
  state
}) {
  return cssStyleBorderRadius({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionFilterShadow({ v, device, state }) {
  return cssStyleBoxShadow({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionMarginTop({ v, device, state }) {
  return `margin-top: -${styleBorderWidthUngrouped({ v, device, state })}px `;
}

export function cssStyleElementAccordionSpacing({ v, device, state }) {
  return `margin-bottom: ${styleElementAccordionSpacing({
    v,
    device,
    state
  })}px `;
}

export function cssStyleElementAccordionFilterSpacing({ v, device, state }) {
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
}) {
  return `margin-bottom:${styleElementAccordionFilterAfterSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleElementAccordionNavAlign({ v, device, state }) {
  const horizontalAlign = styleAlignHorizontal({ v, device, state });

  return horizontalAlign === "right"
    ? "flex-direction: row-reverse;"
    : horizontalAlign === "center"
    ? "justify-content: center;"
    : "";
}


export function cssStyleElementAccordionNavIconSpacing({ v, device, state }) {
  const horizontalAlign = styleAlignHorizontal({ v, device, state });

  return horizontalAlign === "right"
    ? "margin: 0 10px 0 0;"
    : "margin: 0 0 0 10px;";
}

export function cssStyleElementAccordionNavIconSize({ v, device }) {
  const size = styleTypography2FontSize({ v, device }) * 0.75;
  return `font-size: ${size}px;`;
}

export function cssStyleElementAccordionFilterHorizontalAlign({
  v,
  device,
  state
}) {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "filter" });
}

export function cssStyleElementAccordionFilterPaddingFourFields({ v, device }) {
  return cssStylePaddingFourFields({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordion3LetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "filter" });
}

export function cssStyleElementAccordionActiveColor({ v, device }) {
  return cssStyleColor({ v, device, state: "active", prefix: "color" });
}

export function cssStyleElementAccordionActiveBgColor({ v, device }) {
  return cssStyleBgColor({ v, device, state: "active", prefix: "bg" });
}

export function cssStyleElementAccordionActiveBorder({ v, device }) {
  return cssStyleBorder({ v, device, state: "active" });
}

export function cssStyleElementAccordionActiveShadow({ v, device }) {
  return cssStyleBoxShadow({ v, device, state: "active" });
}

export function cssStyleElementAccordionAnimDuration({ v }) {
  return `transition: height ${v.animDuration}s ease-out;`;
}

export function cssStyleElementAccordionTitlePadding({ v, device }) {
  return cssStylePaddingFourFields({ v, device, prefix: "title" });
}

export function cssStyleElementAccordionPropertyHoverTransition() {
  return "transition-property: color, box-shadow, background, border-color;";
}
