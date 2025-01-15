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
  prefix = "iconColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartSubtotalDisabled({ v, device, state }) {
  const disabled = styleElementWOOCartSubtotalDisabled({ v, device, state });

  return disabled === undefined || disabled === "on"
    ? ""
    : cssStyleDisplayNone();
}

export function cssStyleElementWOOCartPurchasesDisabled({ v, device, state }) {
  const disabled = styleElementWOOCartPurchasesDisabled({ v, device, state });

  return disabled === undefined || disabled === "off"
    ? ""
    : "content: attr(data-counter);";
}

export function cssStyleElementWOOCartPurchasesColor({
  v,
  device,
  state,
  prefix = "purchasesColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartPurchasesFontFamily({
  v,
  device,
  store,
  prefix = "purchases",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartPurchasesFontSize({
  v,
  device,
  store,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementWOOCartPurchasesLineHeight({
  v,
  device,
  store,
  prefix = "purchases"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartPurchasesFontWeight({
  v,
  device,
  store,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartPurchasesLetterSpacing({
  v,
  device,
  store,
  prefix = "purchases"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix });
}

export function cssStyleElementWOOCartPurchasesFontVariation({
  v,
  device,
  store,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix });
}

export function cssStyleElementWOOCartPurchasesTextTransform({
  v,
  device,
  store,
  state,
  prefix = "purchases"
}) {
  return cssStyleTextTransforms({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartTitleFontFamily({
  v,
  device,
  store,
  prefix = "title",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartTitleFontSize({
  v,
  device,
  store,
  prefix = "title"
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementWOOCartTitleLineHeight({
  v,
  device,
  store,
  prefix = "title"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartTitleFontWeight({
  v,
  device,
  store,
  prefix = "title"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartTitleLetterSpacing({
  v,
  device,
  store,
  prefix = "title"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix });
}

export function cssStyleElementWOOCartTitleFontVariation({
  v,
  device,
  store,
  prefix = "title"
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix });
}

export function cssStyleElementWOOCartTitleTextTransform({
  v,
  device,
  store,
  state,
  prefix = "title"
}) {
  return cssStyleTextTransforms({ v, device, store, state, prefix });
}
export function cssStyleElementWOOCartCostFontFamily({
  v,
  device,
  store,
  prefix = "cost",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartCostFontSize({
  v,
  device,
  store,
  prefix = "cost"
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementWOOCartCostLineHeight({
  v,
  device,
  store,
  prefix = "cost"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartCostFontWeight({
  v,
  device,
  store,
  prefix = "cost"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartCostLetterSpacing({
  v,
  device,
  store,
  prefix = "cost"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix });
}

export function cssStyleElementWOOCartCostFontVariation({
  v,
  device,
  store,
  prefix = "cost"
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix });
}

export function cssStyleElementWOOCartCostTextTransform({
  v,
  device,
  store,
  state,
  prefix = "cost"
}) {
  return cssStyleTextTransforms({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartSubtotalFontFamily({
  v,
  device,
  store,
  prefix = "subtotal",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartSubtotalFontSize({
  v,
  device,
  store,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementWOOCartSubtotalLineHeight({
  v,
  device,
  store,
  prefix = "subtotal"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartSubtotalFontWeight({
  v,
  device,
  store,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartSubtotalLetterSpacing({
  v,
  device,
  store,
  prefix = "subtotal"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix });
}

export function cssStyleElementWOOCartSubtotalFontVariation({
  v,
  device,
  store,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix });
}

export function cssStyleElementWOOCartSubtotalTextTransform({
  v,
  device,
  store,
  state,
  prefix = "subtotal"
}) {
  return cssStyleTextTransforms({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartButtonFontFamily({
  v,
  device,
  store,
  prefix = "button",
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementWOOCartButtonFontSize({
  v,
  device,
  store,
  prefix = "button"
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementWOOCartButtonLineHeight({
  v,
  device,
  store,
  prefix = "button"
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartButtonFontWeight({
  v,
  device,
  store,
  prefix = "button"
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementWOOCartButtonLetterSpacing({
  v,
  device,
  store,
  prefix = "button"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix });
}

export function cssStyleElementWOOCartButtonFontVariation({
  v,
  device,
  store,
  prefix = "button"
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix });
}

export function cssStyleElementWOOCartButtonTextTransform({
  v,
  device,
  store,
  prefix = "button",
  state
}) {
  return cssStyleTextTransforms({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartTitleColor({
  v,
  device,
  store,
  state,
  prefix = "titleColor"
}) {
  return cssStyleColor({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartCostColor({
  v,
  device,
  store,
  state,
  prefix = "costColor"
}) {
  return cssStyleColor({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartSubtotalColor({
  v,
  device,
  store,
  state,
  prefix = "subtotalColor"
}) {
  return cssStyleColor({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartButtonColor({
  v,
  device,
  store,
  state,
  prefix = "buttonColor"
}) {
  return cssStyleColor({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartButtonBgColor({
  v,
  device,
  store,
  state,
  prefix = "buttonBg"
}) {
  return cssStyleBgColor({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartSidebarBgColor({
  v,
  device,
  store,
  state,
  prefix = "sidebarBg"
}) {
  return cssStyleBgColor({ v, device, store, state, prefix });
}

export function cssStyleElementWOOCartButtonDirection({ v, device, state }) {
  const direction =
    styleElementWOOCartButtonDirection({ v, device, state }) === "inline"
      ? "row"
      : "column";

  return direction === undefined ? "" : `flex-direction: ${direction};`;
}

export function cssStyleElementWOOCartButtonSpacing({ v, device, state }) {
  const direction = styleElementWOOCartButtonDirection({ v, device, state });
  const spacing = styleElementWOOCartButtonSpacing({ v, device, state });

  return spacing === undefined
    ? ""
    : direction === "inline"
      ? `width: calc(50% - ${spacing / 2}px);`
      : `width: 100%; margin-bottom: ${spacing}px;`;
}

export function cssStyleElementWOOCartButtonBorderRadius({ v, device, state }) {
  return cssStyleBorderRadiusType({ v, device, state, prefix: "button" });
}

export function cssStyleElementWOOCartSidebarHorizontalAlign({
  v,
  device,
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
    state
  });

  return horizontalAlign === undefined || horizontalAlign === null
    ? ""
    : align[horizontalAlign];
}

export function cssStyleElementWOOCartSidebarVerticalAlign({
  v,
  device,
  state
}) {
  const heightStyle = styleElementWOOCartSidebarHeightStyle({
    v,
    device,
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
  state
}) {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "sidebar" });
}

export function cssStyleElementWOOCartSidebarHeight({ v, device, state }) {
  const heightStyle = styleElementWOOCartSidebarHeightStyle({
    v,
    device,
    state
  });
  const height = styleElementWOOCartSidebarHeight({ v, device, state });
  const heightSuffix = styleElementWOOCartSidebarHeightSuffix({
    v,
    device,
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
  prefix = "bubbleColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartBubbleBg({
  v,
  device,
  state,
  store,
  prefix = "bubbleBg"
}) {
  return styleElementWOOCartPurchasesType({ v, device, state }) !== "bubble"
    ? "background-color: transparent;"
    : cssStyleBgColorHex({ v, device, state, store, prefix });
}

export function cssStyleElementWOOCartIconSize({ v, device, store, state }) {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    store,
    prefix: "iconCustom"
  });
}
