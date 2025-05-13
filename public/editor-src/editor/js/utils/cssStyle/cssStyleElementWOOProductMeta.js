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
  getConfig,
  prefix = "category",
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix,
        store,
        getConfig,
        renderContext
      })};`
    : "";
}

export function cssStyleElementWOOProductMetaCategoryFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "category"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaCategoryLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "category"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaCategoryFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "category"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaCategoryLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "category"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaCategoryFontVariation({
  v,
  device,
  getConfig,
  store,
  prefix = "category"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOProductMetaCategoryTextTransform({
  v,
  device,
  store,
  state,
  getConfig,
  prefix = "category"
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOProductMetaValueFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "value",
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        getConfig,
        prefix,
        renderContext
      })};`
    : "";
}

export function cssStyleElementWOOProductMetaValueFontSize({
  v,
  device,
  getConfig,
  store,
  prefix = "value"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaValueLineHeight({
  v,
  device,
  getConfig,
  store,
  prefix = "value"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaValueFontWeight({
  v,
  device,
  getConfig,
  store,
  prefix = "value"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix
  })};`;
}

export function cssStyleElementWOOProductMetaValueLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "value"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  })}px;`;
}

export function cssStyleElementWOOProductMetaValueFontVariation({
  v,
  device,
  getConfig,
  store,
  prefix = "value"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOProductMetaValueTextTransform({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "value"
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix
  });
}

export function cssStyleElementWOOProductMetaTopSpacing({
  v,
  device,
  getConfig,
  state
}) {
  const spacing = styleElementWOOProductMetaTopSpacing({
    v,
    device,
    getConfig,
    state
  });
  const type = styleElementWOOProductMetaType({
    v,
    device,
    getConfig,
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
  getConfig,
  state
}) {
  const spacing = styleElementWOOProductMetaRightSpacing({
    v,
    device,
    getConfig,
    state
  });
  const type = styleElementWOOProductMetaType({
    v,
    device,
    getConfig,
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
  getConfig,
  state
}) {
  const spacing = styleElementWOOProductMetaRightSpacing({
    v,
    device,
    getConfig,
    state
  });
  const type = styleElementWOOProductMetaType({
    v,
    device,
    getConfig,
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
  getConfig,
  store,
  state
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "categoryColor"
  });
}

export function cssStyleElementWOOProductMetaValueColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "valueColor",
    state
  });
}

export function cssStyleElementWOOProductMetaDividers({
  v,
  device,
  state,
  getConfig,
  store
}) {
  const type = styleElementWOOProductMetaType({
    v,
    getConfig,
    device,
    state
  });

  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "dividersColor"
  });

  return color === undefined
    ? ""
    : type === "inline"
      ? "border-top: 0;"
      : `border-top: 1px solid ${color};`;
}
