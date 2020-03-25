import {
  styleColor,
  styleElementWOOAdditionalSpacing,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleElementWOOAdditionalBorderWidth
} from "visual/utils/style2";

export function cssStyleElementWOOAdditionalTitleFontFamily({
  v,
  device,
  prefix = "title"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementWOOAdditionalTitleFontSize({
  v,
  device,
  prefix = "title"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOAdditionalTitleLineHeight({
  v,
  device,
  prefix = "title"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOAdditionalTitleFontWeight({
  v,
  device,
  prefix = "title"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOAdditionalTitleLetterSpacing({
  v,
  device,
  prefix = "title"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOAdditionalAttributesFontFamily({
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

export function cssStyleElementWOOAdditionalAttributesFontSize({
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

export function cssStyleElementWOOAdditionalAttributesLineHeight({
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

export function cssStyleElementWOOAdditionalAttributesFontWeight({
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

export function cssStyleElementWOOAdditionalAttributesLetterSpacing({
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

export function cssStyleElementWOOAdditionalSpacing({ v, device, state }) {
  const spacing = styleElementWOOAdditionalSpacing({ v, device, state });
  return spacing === undefined ? "" : `padding-left: ${spacing}px;`;
}

export function cssStyleElementWOOAdditionalTitleColor({
  v,
  device,
  prefix = "titleColor",
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

export function cssStyleElementWOOAdditionalAttributeColor({
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

export function cssStyleElementWOOAdditionalBorderColor({
  v,
  device,
  prefix = "borderColor",
  state
}) {
  const borderColor = styleColor({
    v,
    device,
    prefix,
    state
  });
  return borderColor === undefined ? "" : `border-color:${borderColor};`;
}

export function cssStyleElementWOOAdditionalBorderWidth({ v, device, state }) {
  const borderWidth = styleElementWOOAdditionalBorderWidth({
    v,
    device,
    state
  });

  return borderWidth === undefined ? "" : `border-width: ${borderWidth}px;`;
}
