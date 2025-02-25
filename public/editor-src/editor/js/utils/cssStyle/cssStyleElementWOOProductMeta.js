import {
  cssStyleColor,
  cssStyleTextTransforms,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  styleColor,
  styleElementWOOProductMetaRightSpacing,
  styleElementWOOProductMetaTopSpacing,
  styleElementWOOProductMetaType,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
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
  store,
  prefix = "category",
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix,
        store,
        renderContext
      })};`
    : "";
}

export function cssStyleElementWOOProductMetaCategoryFontSize({
  v,
  device,
  store,
  prefix = "category"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaCategoryLineHeight({
  v,
  device,
  store,
  prefix = "category"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaCategoryFontWeight({
  v,
  device,
  store,
  prefix = "category"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaCategoryLetterSpacing({
  v,
  device,
  store,
  prefix = "category"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaCategoryFontVariation({
  v,
  device,
  store,
  prefix = "category"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementWOOProductMetaCategoryTextTransform({
  v,
  device,
  store,
  state,
  prefix = "category"
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    prefix
  });
}

export function cssStyleElementWOOProductMetaValueFontFamily({
  v,
  device,
  store,
  prefix = "value",
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        prefix,
        renderContext
      })};`
    : "";
}

export function cssStyleElementWOOProductMetaValueFontSize({
  v,
  device,
  store,
  prefix = "value"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaValueLineHeight({
  v,
  device,
  store,
  prefix = "value"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaValueFontWeight({
  v,
  device,
  store,
  prefix = "value"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaValueLetterSpacing({
  v,
  device,
  store,
  prefix = "value"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaValueFontVariation({
  v,
  device,
  store,
  prefix = "value"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementWOOProductMetaValueTextTransform({
  v,
  device,
  store,
  state,
  prefix = "value"
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    prefix
  });
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
  store,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "categoryColor"
  });
}

export function cssStyleElementWOOProductMetaValueColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    prefix: "valueColor",
    state
  });
}

export function cssStyleElementWOOProductMetaDividers({
  v,
  device,
  state,
  store
}) {
  const type = styleElementWOOProductMetaType({
    v,
    device,
    state
  });

  const color = styleColor({
    v,
    device,
    state,
    store,
    prefix: "dividersColor"
  });

  return color === undefined
    ? ""
    : type === "inline"
      ? "border-top: 0;"
      : `border-top: 1px solid ${color};`;
}
