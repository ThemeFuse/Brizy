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
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "title",
    renderContext
  });
}

export function cssStyleElementWOOAdditionalTitleFontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleLineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleFontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleLetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "title"
  });
}

export function cssStyleElementWOOAdditionalTitleTextTransform({
  v,
  state,
  device,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({ v, device, state, store, prefix: "titleColor" });
}

export function cssStyleElementWOOAdditionalTitleSpacing({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  return `padding-bottom: ${dvv("titleSpacing")}px;`;
}

export function cssStyleElementWOOAttributesAttributesFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "attributes",
    renderContext
  });
}

export function cssStyleElementWOOAttributesAttributesFontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesLineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesFontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesLetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesAttributesTextTransform({
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
    prefix: "attributes"
  });
}

export function cssStyleElementWOOAttributesSpacing({ v, device, state }) {
  const spacing = styleElementWOOAttributesSpacing({ v, device, state });
  const between = styleElementWOOAttributesBetween({ v, device, state });

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
  store
}) {
  return cssStyleColor({ v, device, state, store, prefix: "attributeColor" });
}

export function cssStyleElementWOOAttributesBorder({
  v,
  device,
  state,
  store
}) {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    current: "top"
  });
  const borderStyle = styleBorderStyle({ v, device, state });
  const borderColor = styleBorderColor({ v, device, state, store });
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
  state
}) {
  return styleElementWOOAttributesStyleBorder({ v, device, state }) === "table"
    ? ""
    : "border-bottom-width: 0;";
}
