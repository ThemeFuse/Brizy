import {
  styleElementWOOAttributesSpacing,
  styleElementWOOAttributesBetween,
  styleBorderWidthUngrouped,
  styleBorderStyle,
  styleBorderColor,
  styleElementWOOAttributesStyleBorder
} from "visual/utils/style2";
import { cssStyleColor } from "visual/utils/cssStyle";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleElementWOOAdditionalTitleFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "title" });
}

export function cssStyleElementWOOAdditionalTitleColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementWOOAdditionalTitleSpacing({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  return `padding-bottom: ${dvv("titleSpacing")}px;`;
}

export function cssStyleElementWOOAttributesAttributesFontFamily({
  v,
  device
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "attributes" });
}

export function cssStyleElementWOOAttributesAttributesFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "attributes" });
}

export function cssStyleElementWOOAttributesAttributesLineHeight({
  v,
  device
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "attributes" });
}

export function cssStyleElementWOOAttributesAttributesFontWeight({
  v,
  device
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "attributes" });
}

export function cssStyleElementWOOAttributesAttributesLetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "attributes" });
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
  state
}) {
  return cssStyleColor({ v, device, state, prefix: "attributeColor" });
}

export function cssStyleElementWOOAttributesBorder({ v, device, state }) {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    current: "top"
  });
  const borderStyle = styleBorderStyle({ v, device, state });
  const borderColor = styleBorderColor({ v, device, state });
  const styleBorder = styleElementWOOAttributesStyleBorder({
    v,
    device,
    state
  });

  const disabledIsBottom = (styleBorder, borderWidth) => {
    return styleBorder === "table" ? borderWidth : 0;
  };

  return borderWidth === undefined
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
