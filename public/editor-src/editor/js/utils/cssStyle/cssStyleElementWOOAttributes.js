import {
  styleColor,
  styleElementWOOAttributesSpacing,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleElementWOOAttributesBetween,
  styleBorderWidthUngrouped,
  styleBorderStyle,
  styleBorderColor,
  styleElementWOOAttributesStyleBorder
} from "visual/utils/style2";

export function cssStyleElementWOOAttributesAttributesFontFamily({
  v,
  device,
  prefix = "attributes"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementWOOAttributesAttributesFontSize({
  v,
  device,
  prefix = "attributes"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOAttributesAttributesLineHeight({
  v,
  device,
  prefix = "attributes"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOAttributesAttributesFontWeight({
  v,
  device,
  prefix = "attributes"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOAttributesAttributesLetterSpacing({
  v,
  device,
  prefix = "attributes"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
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
  prefix = "attributeColor",
  state
}) {
  const color = styleColor({
    v,
    device,
    prefix,
    state
  });
  return color === undefined ? "" : `color:${color};`;
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
