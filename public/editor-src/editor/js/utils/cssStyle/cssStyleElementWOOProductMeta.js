import {
  styleElementWOOProductMetaType,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleElementWOOProductMetaTopSpacing,
  styleElementWOOProductMetaRightSpacing,
  styleColor
} from "visual/utils/style2";

export function cssStyleElementWOOProductMetaType({ v, device, state }) {
  let type =
    styleElementWOOProductMetaType({
      v,
      device,
      state
    }) === "column"
      ? "column"
      : "row";

  return type === undefined ? "" : `flex-direction: ${type};`;
}

export function cssStyleElementWOOProductMetaCategoryFontFamily({
  v,
  device,
  prefix = "category"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementWOOProductMetaCategoryFontSize({
  v,
  device,
  prefix = "category"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaCategoryLineHeight({
  v,
  device,
  prefix = "category"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaCategoryFontWeight({
  v,
  device,
  prefix = "category"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaCategoryLetterSpacing({
  v,
  device,
  prefix = "category"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaValueFontFamily({
  v,
  device,
  prefix = "value"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementWOOProductMetaValueFontSize({
  v,
  device,
  prefix = "value"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaValueLineHeight({
  v,
  device,
  prefix = "value"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaValueFontWeight({
  v,
  device,
  prefix = "value"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaValueLetterSpacing({
  v,
  device,
  prefix = "value"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaTopSpacing({ v, device, state }) {
  const spacing = styleElementWOOProductMetaTopSpacing({ v, device, state });
  const type = styleElementWOOProductMetaType({
    v,
    device,
    state
  });

  return spacing === undefined
    ? ""
    : type === "inline"
    ? "padding-top: 0px;"
    : `padding-top: ${spacing / 2}px; padding-bottom: ${spacing / 2}px;`;
}

export function cssStyleElementWOOProductMetaRightSpacing({
  v,
  device,
  state
}) {
  const spacing = styleElementWOOProductMetaRightSpacing({ v, device, state });
  const type = styleElementWOOProductMetaType({
    v,
    device,
    state
  });

  return spacing === undefined
    ? ""
    : type === "inline"
    ? "padding-left: 10px;"
    : `padding-left: ${spacing}px;`;
}

export function cssStyleElementWOOProductMetaRightSpacingInline({
  v,
  device,
  state
}) {
  const spacing = styleElementWOOProductMetaRightSpacing({ v, device, state });
  const type = styleElementWOOProductMetaType({
    v,
    device,
    state
  });

  return spacing === undefined
    ? ""
    : type === "inline"
    ? `margin-right: ${spacing}px;`
    : "margin-right: 0;";
}

export function cssStyleElementWOOProductMetaCategoryColor({
  v,
  device,
  prefix = "categoryColor",
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

export function cssStyleElementWOOProductMetaValueColor({
  v,
  device,
  prefix = "valueColor",
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

export function cssStyleElementWOOProductMetaDviders({ v, device, state }) {
  const type = styleElementWOOProductMetaType({
    v,
    device,
    state
  });

  const color = styleColor({ v, device, state, prefix: "dvidersColor" });

  return color === undefined
    ? ""
    : type === "inline"
    ? "border-top: 0;"
    : `border-top: 1px solid ${color};`;
}
