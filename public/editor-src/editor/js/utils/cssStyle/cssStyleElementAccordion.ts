import { WithRenderContext } from "visual/providers/RenderProvider";
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
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "filterColor"
  });
}

export function cssStyleElementAccordionFilterActiveColor({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state: "active",
    prefix: "filterColor",
    getConfig
  });
}

export function cssStyleElementAccordionFilterActiveBgColor({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    state: "active",
    prefix: "filterBg",
    getConfig
  });
}

export function cssStyleElementAccordionFilterActiveBorder({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionFilterActiveShadow({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state: "active",
    prefix: "filter",
    getConfig
  });
}

export function cssStyleElementAccordionFilterBgColor({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "filterBg"
  });
}

export function cssStyleElementAccordionFilterBorder({
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
    store,
    prefix: "filter",
    getConfig
  });
}

export function cssStyleElementAccordionFilterBorderRadius({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionFilterShadow({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "filter"
  });
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
  store,
  state,
  getConfig
}: CSSValue): string {
  const horizontalAlign = styleAlignHorizontal({
    v,
    device,
    store,
    getConfig,
    state
  });

  return horizontalAlign === "right"
    ? "flex-direction: row-reverse;"
    : horizontalAlign === "center"
      ? "justify-content: center;"
      : "";
}

export function cssStyleElementAccordionNavIconSpacing({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  const horizontalAlign = styleAlignHorizontal({
    v,
    device,
    store,
    state,
    getConfig
  });

  return horizontalAlign === "right"
    ? "margin: 0 10px 0 0;"
    : "margin: 0 0 0 10px;";
}

export function cssStyleElementAccordionNavIconSize({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleSizeFontSizeIcon({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "nav"
  });
}

export function cssStyleElementAccordionFilterHorizontalAlign({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionFilterPaddingFourFields({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleElementAccordion3FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "filter",
    renderContext
  });
}

export function cssStyleElementAccordion3FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordion3LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordion3FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordion3LetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordion3FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionFilterTextTransform({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "filter"
  });
}

export function cssStyleElementAccordionActiveColor({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state: "active",
    prefix: "color"
  });
}

export function cssStyleElementAccordionActiveBgColor({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    getConfig,
    state: "active",
    prefix: "bg"
  });
}

export function cssStyleElementAccordionActiveBorder({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({ v, device, getConfig, state: "active", store });
}

export function cssStyleElementAccordionActiveShadow({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, getConfig, store, state: "active" });
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
