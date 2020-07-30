import {
  styleAlignHorizontal,
  styleBorderWidthUngrouped,
  styleTypography2FontSize
} from "visual/utils/style2";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import {
  styleElementAccordionFilterAfterSpacing,
  styleElementAccordionFilterSpacing,
  styleElementAccordionNavAlign,
  styleElementAccordionSpacing
} from "visual/utils/style2/styleElementAccordion";
import { cssStylePaddingFourFields } from "visual/utils/cssStyle/cssStylePadding";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";

export function cssStyleElementAccordionFilterColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "filterColor" });
}

export function cssStyleElementAccordionFilterActiveColor({
  v,
  device,
  state
}) {
  return cssStyleColor({ v, device, state, prefix: "activeFilterColor" });
}

export function cssStyleElementAccordionFilterActiveBgColor({
  v,
  device,
  state
}) {
  return cssStyleBgColor({ v, device, state, prefix: "activeFilterBg" });
}

export function cssStyleElementAccordionFilterActiveBorder({
  v,
  device,
  state
}) {
  return cssStyleBorder({ v, device, state, prefix: "activeFilter" });
}

export function cssStyleElementAccordionFilterActiveShadow({
  v,
  device,
  state
}) {
  return cssStyleBoxShadow({ v, device, state, prefix: "activeFilter" });
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
  const horizontalAlign = styleElementAccordionNavAlign({ v, device, state });

  if (horizontalAlign === "right") {
    return "flex-direction: row-reverse;";
  }
}

export function cssStyleElementAccordionNavTextAlign({ v, device, state }) {
  const horizontalAlign = styleElementAccordionNavAlign({ v, device, state });

  if (horizontalAlign === "center") {
    return "margin-left: auto; margin-right: auto;";
  }
}

export function cssStyleElementAccordionNavIconSpacing({ v, device, state }) {
  const horizontalAlign = styleElementAccordionNavAlign({ v, device, state });
  return horizontalAlign === "center" ? "margin-left: 10px;" : "";
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

export function cssStyleElementAccordionFilterPaddingFourFields({
  v,
  device,
  state
}) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "filter" });
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
  return cssStyleColor({ v, device, prefix: "activeColor" });
}

export function cssStyleElementAccordionActiveBgColor({ v, device }) {
  return cssStyleBgColor({ v, device, prefix: "activeBg" });
}

export function cssStyleElementAccordionActiveBorder({ v, device }) {
  return cssStyleBorder({ v, device, prefix: "active" });
}

export function cssStyleElementAccordionActiveShadow({ v, device }) {
  return cssStyleBoxShadow({ v, device, prefix: "active" });
}
