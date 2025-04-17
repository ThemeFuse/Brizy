import {
  cssStyleColor,
  cssStyleTextTransforms,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "visual/utils/onChange";
import {
  styleBorderColor,
  styleBorderStyle,
  styleBorderWidthUngrouped,
  styleElementWOOAttributesBetween,
  styleElementWOOAttributesSpacing,
  styleElementWOOAttributesStyleBorder
} from "visual/utils/style2";

export function cssStyleElementWOOAdditionalTitleFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "title",
    renderContext
  });
}

export function cssStyleElementWOOAdditionalTitleFontSize({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleLineHeight({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleFontWeight({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleLetterSpacing({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleFontVariation({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleTextTransform({
  v,
  state,
  device,
  store,
  getConfig
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "titleColor"
  });
}

export function cssStyleElementWOOAdditionalTitleSpacing({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  return `padding-bottom: ${dvv("titleSpacing")}px;`;
}

export function cssStyleElementWOOAttributesAttributesFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "attributes",
    renderContext
  });
}

export function cssStyleElementWOOAttributesAttributesFontSize({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesLineHeight({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesFontWeight({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesLetterSpacing({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesFontVariation({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesTextTransform({
  v,
  device,
  state,
  store,
  getConfig
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesSpacing({
  v,
  device,
  getConfig,
  state
}) {
  const spacing = styleElementWOOAttributesSpacing({
    v,
    device,
    getConfig,
    state
  });
  const between = styleElementWOOAttributesBetween({
    v,
    device,
    getConfig,
    state
  });

  return spacing === undefined ||
    spacing === null ||
    between === undefined ||
    between === null
    ? ""
    : `padding: ${between}px ${spacing}px;`;
}

export function cssStyleElementWOOAttributesAttributeColor({
  v,
  device,
  state,
  store,
  getConfig
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "attributeColor"
  });
}

export function cssStyleElementWOOAttributesBorder({
  v,
  device,
  state,
  store,
  getConfig
}) {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    current: "top"
  });
  const borderStyle = styleBorderStyle({ v, device, getConfig, state });
  const borderColor = styleBorderColor({ v, device, state, store, getConfig });
  const styleBorder = styleElementWOOAttributesStyleBorder({
    v,
    device,
    state
  });

  const disabledIsBottom = (styleBorder, borderWidth) => {
    return styleBorder === "table" ? borderWidth : 0;
  };

  return borderWidth === undefined || borderStyle === "none"
    ? ""
    : `border-top: ${disabledIsBottom(
        styleBorder,
        borderWidth
      )}px; border-right: ${disabledIsBottom(
        styleBorder,
        borderWidth
      )}px; border-bottom: ${borderWidth}px; border-left: ${disabledIsBottom(
        styleBorder,
        borderWidth
      )}px; border-style: ${borderStyle}; border-color: ${borderColor};`;
}

export function cssStyleElementWOOAttributesLastElementBorder({
  v,
  device,
  getConfig,
  state
}) {
  return styleElementWOOAttributesStyleBorder({
    v,
    device,
    getConfig,
    state
  }) === "table"
    ? ""
    : "border-bottom-width: 0;";
}
