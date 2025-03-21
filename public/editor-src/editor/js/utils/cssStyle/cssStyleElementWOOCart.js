import {
  cssStyleBgColor,
  cssStyleBgColorHex,
  cssStyleBorderRadiusType,
  cssStyleColor,
  cssStyleDisplayNone,
  cssStyleSizeFontSize,
  cssStyleSizeWidth,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import {
  styleElementWOOCartButtonDirection,
  styleElementWOOCartButtonSpacing,
  styleElementWOOCartPurchasesDisabled,
  styleElementWOOCartPurchasesType,
  styleElementWOOCartSidebarHeight,
  styleElementWOOCartSidebarHeightStyle,
  styleElementWOOCartSidebarHeightSuffix,
  styleElementWOOCartSidebarHorizontalAlign,
  styleElementWOOCartSidebarVerticalAlign,
  styleElementWOOCartSubtotalDisabled
} from "visual/utils/style2";

export function cssStyleElementWOOCartIconColor({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "iconColor"
}) {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementWOOCartSubtotalDisabled({
  v,
  device,
  getConfig,
  state
}) {
  const disabled = styleElementWOOCartSubtotalDisabled({
    v,
    device,
    getConfig,
    state
  });

  return disabled === undefined || disabled === "on"
    ? ""
    : cssStyleDisplayNone();
}

export function cssStyleElementWOOCartPurchasesDisabled({
  v,
  device,
  getConfig,
  state
}) {
  const disabled = styleElementWOOCartPurchasesDisabled({
    v,
    device,
    getConfig,
    state
  });

  return disabled === undefined || disabled === "off"
    ? ""
    : "content: attr(data-counter);";
}

export function cssStyleElementWOOCartPurchasesColor({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "purchasesColor"
}) {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementWOOCartPurchasesFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "purchases",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartPurchasesFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartPurchasesLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "purchases"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartPurchasesFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartPurchasesLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "purchases"
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartPurchasesFontVariation({
  v,
  device,
  store,
  getConfig,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartPurchasesTextTransform({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "purchases"
}) {
  return cssStyleTextTransforms({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartTitleFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "title",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartTitleFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "title"
}) {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartTitleLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "title"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartTitleFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "title"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartTitleLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "title"
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartTitleFontVariation({
  v,
  device,
  store,
  getConfig,
  prefix = "title"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartTitleTextTransform({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "title"
}) {
  return cssStyleTextTransforms({ v, device, store, getConfig, state, prefix });
}
export function cssStyleElementWOOCartCostFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "cost",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartCostFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "cost"
}) {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartCostLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "cost"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartCostFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "cost"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartCostLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "cost"
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartCostFontVariation({
  v,
  device,
  store,
  getConfig,
  prefix = "cost"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartCostTextTransform({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "cost"
}) {
  return cssStyleTextTransforms({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartSubtotalFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "subtotal",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartSubtotalFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartSubtotalLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "subtotal"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartSubtotalFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartSubtotalLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "subtotal"
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartSubtotalFontVariation({
  v,
  device,
  store,
  getConfig,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartSubtotalTextTransform({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "subtotal"
}) {
  return cssStyleTextTransforms({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartButtonFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "button",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartButtonFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "button"
}) {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartButtonLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "button"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartButtonFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "button"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementWOOCartButtonLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "button"
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartButtonFontVariation({
  v,
  device,
  store,
  getConfig,
  prefix = "button"
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementWOOCartButtonTextTransform({
  v,
  device,
  store,
  getConfig,
  prefix = "button",
  state
}) {
  return cssStyleTextTransforms({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartTitleColor({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "titleColor"
}) {
  return cssStyleColor({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartCostColor({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "costColor"
}) {
  return cssStyleColor({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartSubtotalColor({
  v,
  device,
  store,
  state,
  getConfig,
  prefix = "subtotalColor"
}) {
  return cssStyleColor({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartButtonColor({
  v,
  device,
  store,
  state,
  getConfig,
  prefix = "buttonColor"
}) {
  return cssStyleColor({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartButtonBgColor({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "buttonBg"
}) {
  return cssStyleBgColor({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartSidebarBgColor({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "sidebarBg"
}) {
  return cssStyleBgColor({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementWOOCartButtonDirection({
  v,
  device,
  getConfig,
  state
}) {
  const direction =
    styleElementWOOCartButtonDirection({ v, device, getConfig, state }) ===
    "inline"
      ? "row"
      : "column";

  return direction === undefined ? "" : `flex-direction: ${direction};`;
}

export function cssStyleElementWOOCartButtonSpacing({
  v,
  device,
  getConfig,
  state
}) {
  const direction = styleElementWOOCartButtonDirection({
    v,
    device,
    getConfig,
    state
  });
  const spacing = styleElementWOOCartButtonSpacing({
    v,
    device,
    getConfig,
    state
  });

  return spacing === undefined
    ? ""
    : direction === "inline"
      ? `width: calc(50% - ${spacing / 2}px);`
      : `width: 100%; margin-bottom: ${spacing}px;`;
}

export function cssStyleElementWOOCartButtonBorderRadius({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBorderRadiusType({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementWOOCartSidebarHorizontalAlign({
  v,
  device,
  getConfig,
  state
}) {
  const align = {
    left: "left: 0; margin-right: auto; margin-left: 0;",
    center: "left: 0; right: 0; margin-left: auto; margin-right: auto;",
    right: "right: 0; margin-right: 0; margin-left: auto;"
  };

  const horizontalAlign = styleElementWOOCartSidebarHorizontalAlign({
    v,
    device,
    getConfig,
    state
  });

  return horizontalAlign === undefined || horizontalAlign === null
    ? ""
    : align[horizontalAlign];
}

export function cssStyleElementWOOCartSidebarVerticalAlign({
  v,
  device,
  getConfig,
  state
}) {
  const heightStyle = styleElementWOOCartSidebarHeightStyle({
    v,
    device,
    getConfig,
    state
  });
  const align = {
    top: "top: 0; margin-top: 0; margin-bottom: auto;",
    center:
      heightStyle === "auto"
        ? "top: 50%; margin-top: auto; margin-bottom: auto; transform: translate(0, -50%);"
        : "top: 0; bottom: 0; margin-top: auto; margin-bottom: auto;",
    bottom: "top: auto; bottom: 0; margin-top: auto; margin-bottom: 0;"
  };

  const verticalAlign = styleElementWOOCartSidebarVerticalAlign({
    v,
    device,
    getConfig,
    state
  });

  return verticalAlign === undefined || verticalAlign === null
    ? ""
    : align[verticalAlign];
}

export function cssStyleElementWOOCartSidebarWidth({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sidebar"
  });
}

export function cssStyleElementWOOCartSidebarHeight({
  v,
  device,
  getConfig,
  state
}) {
  const heightStyle = styleElementWOOCartSidebarHeightStyle({
    v,
    device,
    getConfig,
    state
  });
  const height = styleElementWOOCartSidebarHeight({
    v,
    device,
    getConfig,
    state
  });
  const heightSuffix = styleElementWOOCartSidebarHeightSuffix({
    v,
    device,
    getConfig,
    state
  });

  const heightType = {
    auto: "auto",
    custom: `${height}${heightSuffix}`,
    fullHeight: "100vh"
  };

  return (height === undefined || height === null) &&
    (heightSuffix === undefined || heightSuffix === null)
    ? ""
    : `height:${heightType[heightStyle]};`;
}

export function cssStyleElementWOOCartBubbleColor({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "bubbleColor"
}) {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementWOOCartBubbleBg({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "bubbleBg"
}) {
  return styleElementWOOCartPurchasesType({ v, device, state }) !== "bubble"
    ? "background-color: transparent;"
    : cssStyleBgColorHex({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementWOOCartIconSize({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "iconCustom"
  });
}
