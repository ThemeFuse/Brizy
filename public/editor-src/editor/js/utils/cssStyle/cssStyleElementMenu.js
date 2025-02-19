import { isEditor } from "visual/providers/RenderProvider";
import {
  cssStyleBgColor,
  cssStyleBgColorHex,
  cssStyleBgGradient,
  cssStyleBgImage,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleCustomIconColor,
  cssStyleDisplayFlex,
  cssStyleDisplayInlineBlock,
  cssStyleDisplayNone,
  cssStyleFilter,
  cssStyleFlexHorizontalAlign,
  cssStyleHoverTransition,
  cssStyleMargin,
  cssStylePadding,
  cssStylePaddingFourFields,
  cssStylePositionAbsolute,
  cssStylePositionRelative,
  cssStyleSizeFontSize,
  cssStyleSizeFontSizeIcon,
  cssStyleSizeMaxWidthSize,
  cssStyleTextAlign,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { ACTIVE } from "visual/utils/stateMode";
import {
  styleAlignHorizontal,
  styleBorderColor,
  styleBorderStyle,
  styleBorderWidthGrouped,
  styleColor,
  styleElementMMenu,
  styleElementMMenuIconPosition,
  styleElementMMenuIconSpacing,
  styleElementMenuIconPosition,
  styleElementMenuIconSpacing,
  styleElementMenuMode,
  styleElementMenuSubMenuIconPosition,
  styleElementMenuSubMenuIconSpacing,
  styleItemMarginBottom,
  styleItemMarginLeft,
  styleItemMarginRight,
  styleItemMarginTop,
  styleItemPaddingBottom,
  styleItemPaddingTop,
  styleTypography2FontSize,
  styleTypography2LineHeight
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";

export function cssStyleElementMenuIconPosition({ v, device, state }) {
  const iconPosition = styleElementMenuIconPosition({ v, device, state });

  return iconPosition === "right"
    ? "flex-flow: row-reverse nowrap; justify-content: flex-end;"
    : "flex-flow: row nowrap;";
}

export function cssStyleElementMenuIconSpacing({ v, device, state }) {
  const iconPosition = styleElementMenuIconPosition({ v, device, state });
  const iconSpacing = styleElementMenuIconSpacing({ v, device, state });

  switch (iconPosition) {
    case "left":
      return `margin:0 ${iconSpacing}px 0 0;`;
    case "right":
      return `margin:0 0 0 ${iconSpacing}px;`;
  }
}

export function cssStyleElementMenuIconSize({ v, device, store, state }) {
  return cssStyleSizeFontSize({ v, device, state, store, prefix: "icon" });
}

export function cssStyleElementMenuShowIcon({ v, device, state }) {
  const mMenu = styleElementMMenu({ v, device, state });

  return mMenu === "on" ? cssStyleDisplayFlex() : cssStyleDisplayNone();
}

export function cssStyleElementMenuShow({ v, device, state }) {
  const mMenu = styleElementMMenu({ v, device, state });

  return mMenu === "on" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementMenuMode({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "display: flex; flex-wrap: wrap; justify-content: inherit; align-items: center;";
  }

  return cssStyleDisplayInlineBlock();
}

export function cssStyleElementMenuSize({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  return mode === "vertical"
    ? `${cssStyleSizeMaxWidthSize({
        v,
        device,
        state,
        prefix: "menu"
      })} width:100%;`
    : "max-width: none;";
}

export function cssStyleElementMenuBgColor({ v, device, store, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "vertical") {
    return cssStyleBgColor({ v, device, state, store, prefix: "menuBg" });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuBgCloseColor({ v, device, state, store }) {
  return cssStyleBgColorHex({ v, device, state, store, prefix: "closeBg" });
}

export function cssStyleElementMenuLinkBgColor({ v, device, store, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return cssStyleBgColor({ v, device, state, store, prefix: "menuBg" });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuBorder({ v, device, state, store }) {
  return cssStyleBorder({ v, device, state, store, prefix: "menu" });
}

export function cssStyleElementMenuPadding({ v, device, state }) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "menu" });
}

// Current
export function cssStyleElementMenuCurrentColor({ v, device, store }) {
  return cssStyleColor({ v, device, store, state: ACTIVE });
}

export function cssStyleElementMenuCurrentBgColor({ v, device, store }) {
  return cssStyleBgColor({
    v,
    device,
    store,
    state: ACTIVE,
    prefix: "menuBg"
  });
}

export function cssStyleElementMenuCurrentLinkBgColor({
  v,
  device,
  state,
  store
}) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return cssStyleBgColor({
      v,
      device,
      store,
      state: ACTIVE,
      prefix: "menuBg"
    });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuCurrentBorder({ v, device, store }) {
  return cssStyleBorder({ v, device, state: ACTIVE, store, prefix: "menu" });
}

export function cssStyleElementMenuBorderRadius({ v, device, state, store }) {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "menu" });
}

// MMenu
export function cssStyleElementMMenuSize({ v, device, state, store }) {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    store,
    prefix: "mMenu"
  });
}

export function cssStyleElementMMenuFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "mMenu",
    renderContext
  });
}

export function cssStyleElementMMenuFontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "mMenu" });
}

export function cssStyleElementMMenuLineHeight({ v, device, store }) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "mMenu" });
}

export function cssStyleElementMMenuFontWeight({ v, device, store }) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "mMenu" });
}

export function cssStyleElementMMenuLetterSpacing({ v, device, store }) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "mMenu"
  });
}

export function cssStyleElementMMenuFontVariation({ v, device, store }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "mMenu"
  });
}

export function cssStyleElementMMenuTextTransform({ v, device, store, state }) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "mMenu" });
}

export function cssStyleElementMMenuColor({ v, device, store, state }) {
  return cssStyleColor({ v, device, state, store, prefix: "mMenuColor" });
}

export function cssStyleElementMMenuTitleColor({ v, device, store }) {
  return cssStyleColor({ v, device, store, prefix: "mMenuColor" });
}

export function cssStyleElementMMenuActiveColor({ v, device, store }) {
  return cssStyleColor({
    v,
    device,
    store,
    state: ACTIVE,
    prefix: "mMenuColor"
  });
}

export function cssStyleElementMenuColor({ v, device, state, store }) {
  return cssStyleColor({ v, device, state, store });
}

export function cssStyleElementMenuCloseColor({ v, device, state, store }) {
  return cssStyleColor({ v, device, state, store, prefix: "closeColor" });
}

export function cssStyleElementMMenuBorderColor({ v, device, state, store }) {
  const borderColor = styleBorderColor({
    v,
    device,
    state,
    store,
    prefix: "mMenu"
  });

  return `border-color: ${borderColor};`;
}

export function cssStyleElementMMenuBackgroundColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleBgColor({ v, device, state, store, prefix: "mMenuBg" });
}

export function cssStyleElementMMenuDynamicImage({ v, device, state }) {
  const bgPopulation = defaultValueValue({
    v,
    device,
    key: "bgPopulation",
    state
  });

  const bg = defaultValueValue({ v, key: "bg", device, state });

  return bgPopulation !== "" ? `background-image: url("${bg}")` : "";
}

export function cssStyleElementMMenuImageFilter({ v, device, state }) {
  const imageSrc = defaultValueValue({ v, device, state, key: "bgImageSrc" });
  const population = defaultValueValue({
    v,
    device,
    state,
    key: "bgPopulation"
  });

  return imageSrc !== "" || population !== ""
    ? cssStyleFilter({ v, device, state })
    : "";
}

export function cssStyleElementMMenuGradientBgColor({
  v,
  state,
  device,
  store
}) {
  return cssStyleBgGradient({ v, state, device, store, prefix: "mMenu" });
}

export function cssStyleElementMMenuItemHorizontalAlign({
  v,
  device,
  state,
  store,
  prefix = "mMenuItem"
}) {
  const align = styleAlignHorizontal({ v, device, state, store, prefix });
  const iconPosition = styleElementMMenuIconPosition({ v, device, state });

  if (iconPosition === "left") {
    return cssStyleFlexHorizontalAlign({ v, device, store, state, prefix });
  }

  switch (align) {
    case "center":
      return cssStyleFlexHorizontalAlign({ v, device, store, state, prefix });
    case "left":
      return "justify-content: flex-end;";
    case "right":
      return "justify-content: flex-start;";
  }

  return "";
}

export function cssStyleElementMMenuItemTextHorizontalAlign({
  v,
  device,
  state
}) {
  return cssStyleTextAlign({ v, device, state, prefix: "mMenuItem" });
}

export function cssStyleElementMMenuIconColor({ v, device, state, store }) {
  return cssStyleColor({ v, device, state, store, prefix: "mMenuIconColor" });
}

export function cssStyleElementMMenuIconSpacing({ v, device, state }) {
  const iconPosition = styleElementMMenuIconPosition({ v, device, state });
  const iconSpacing = styleElementMMenuIconSpacing({ v, device, state });

  switch (iconPosition) {
    case "left":
      return `margin:0 ${iconSpacing}px 0 0;`;
    case "right":
      return `margin:0 0 0 ${iconSpacing}px;`;
  }
}

export function cssStyleElementMMenuIconSize({ v, device, state }) {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    prefix: "mMenuIcon"
  });
}

export function cssStyleElementMMenuIconCloseSize({ v, device, state }) {
  return cssStyleSizeFontSizeIcon({
    v,
    device,
    state,
    prefix: "close"
  });
}

export function cssStyleElementMMenuIconPosition({ v, device, state }) {
  const iconPosition = styleElementMMenuIconPosition({ v, device, state });

  return iconPosition === "right"
    ? "flex-flow: row-reverse nowrap;"
    : "flex-flow: row nowrap;";
}

export function cssStyleElementMMenuBtnNext({ v, device, store }) {
  const mMenuLineHeight = styleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "mMenu"
  });
  const mMenuFontSize = styleTypography2FontSize({
    v,
    device,
    store,
    prefix: "mMenu"
  });
  const {
    paddingTop,
    paddingTopSuffix,
    paddingBottom,
    paddingBottomSuffix,
    paddingRight,
    paddingRightSuffix
  } = cssStylePadding({ v, device, prefix: "mMenu" });

  const typographyHeightSuffix = isNaN(mMenuLineHeight) ? "" : "px";
  const typographyHeight = `${mMenuLineHeight} * ${mMenuFontSize}${typographyHeightSuffix}`;
  const _paddingTop = `${paddingTop}${paddingTopSuffix}`;
  const _paddingBottom = `${paddingBottom}${paddingBottomSuffix}`;
  const height = `height: calc(${typographyHeight} + ${_paddingTop} + ${_paddingBottom})`;

  return `${height}; padding-right: ${paddingRight}${paddingRightSuffix};`;
}

export function cssStyleElementMMenuListViewMargin({ v, device }) {
  const mode = styleElementMenuMode({ v, device });

  if (mode === "vertical") {
    return "margin: 0;";
  }

  const marginTop = styleItemMarginTop({ v, device });
  const marginRight = styleItemMarginRight({ v, device });
  const marginBottom = styleItemMarginBottom({ v, device });
  const marginLeft = styleItemMarginLeft({ v, device });

  return `margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft};`;
}

export function cssStyleElementMMenuItemPadding({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });
  const dvv = (key) => defaultValueValue({ key, v, device, state });
  const itemPadding = `${parseFloat(dvv("itemPadding") / 2)}px`;
  const paddingTop = styleItemPaddingTop({ v, device });
  const paddingBottom = styleItemPaddingBottom({ v, device });

  if (mode === "horizontal") {
    return `padding-top:${paddingTop}; padding-bottom:${paddingBottom}; margin-right:${itemPadding}; margin-left:${itemPadding};`;
  }

  return `margin-top:${itemPadding}; margin-bottom:${itemPadding}; margin-right:0; margin-left:0;`;
}

export function cssStyleElementMMenuItemPaddingTopZero({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "";
  }

  return "margin-top: 0;";
}

export function cssStyleElementMMenuItemPaddingBottomZero({
  v,
  device,
  state
}) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "";
  }

  return "margin-bottom: 0;";
}

export function cssStyleElementMMenuPadding({ v, device, state }) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "mMenu" });
}

export function cssStyleElementMMenuClosePadding({ v, device, state }) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "close" });
}

export function cssStyleElementMMenuCloseMargin({ v, device, state }) {
  return cssStyleMargin({ v, device, state, prefix: "close" });
}

export function cssStyleElementMMenuCloseTransition({
  v,
  device,
  store,
  state
}) {
  return cssStyleHoverTransition({ v, device, store, state, prefix: "close" });
}

// SubMenu
export function cssStyleElementMenuSubMenuFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "subMenu",
    renderContext
  });
}

export function cssStyleElementMenuSubMenuFontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuLineHeight({ v, device, store }) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuFontWeight({ v, device, store }) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuLetterSpacing({ v, device, store }) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "subMenu"
  });
}

export function cssStyleElementMenuSubMenuFontVariation({ v, device, store }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "subMenu"
  });
}

export function cssStyleElementMenuSubMenuTextTransform({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextTransforms({ v, device, store, state, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuColor({ v, device, store, state }) {
  return cssStyleColor({ v, device, store, state, prefix: "subMenuColor" });
}

export function cssStyleElementMenuSubMenuIconPosition({ v, device, state }) {
  const iconPosition = styleElementMenuSubMenuIconPosition({
    v,
    device,
    state
  });

  return iconPosition === "right"
    ? "flex-flow: row-reverse nowrap; justify-content: flex-end;"
    : "flex-flow: row nowrap;";
}

export function cssStyleElementMenuSubMenuIconSpacing({ v, device, state }) {
  const iconPosition = styleElementMenuSubMenuIconPosition({
    v,
    device,
    state
  });
  const iconSpacing = styleElementMenuSubMenuIconSpacing({ v, device, state });

  switch (iconPosition) {
    case "left":
      return `margin:0 ${iconSpacing}px 0 0;`;
    case "right":
      return `margin:0 0 0 ${iconSpacing}px;`;
  }
}

export function cssStyleElementMenuSubMenuIconSize({
  v,
  device,
  store,
  state
}) {
  return cssStyleSizeFontSize({
    v,
    device,
    store,
    state,
    prefix: "subMenuIcon"
  });
}

export function cssStyleElementMenuSubMenuBgColor({ v, device, store, state }) {
  return cssStyleBgColor({ v, device, store, state, prefix: "subMenuBg" });
}

export function cssStyleElementMenuSubMenuBorderColor({
  v,
  device,
  store,
  state
}) {
  const color = styleColor({ v, device, store, state, prefix: "subMenuColor" });

  return `border-color: ${color};`;
}

export function cssStyleElementMenuSubMenuBorderBottom({
  v,
  device,
  state,
  store,
  prefix = "subMenu"
}) {
  const color = styleBorderColor({ v, device, state, store, prefix });
  const style = styleBorderStyle({ v, device, state, prefix });
  const width = styleBorderWidthGrouped({ v, device, state, prefix });

  return `border-bottom: ${width}px ${style} ${color};`;
}

// SubMenu Current
export function cssStyleElementMenuSubMenuCurrentColor({ v, device, store }) {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "subMenuColor"
  });
}

export function cssStyleElementMenuSubMenuCurrentBgColor({ v, device, store }) {
  return cssStyleBgColor({
    v,
    device,
    store,
    state: ACTIVE,
    prefix: "subMenuBg"
  });
}

export function cssStyleElementMenuSubMenuCurrentBoxShadow({
  v,
  device,
  store
}) {
  return cssStyleBoxShadow({ v, device, store, state: ACTIVE });
}

export function cssStyleElementMenuSubMenuCustomIconColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleCustomIconColor({
    v,
    device,
    store,
    state,
    prefix: "subMenuColor"
  });
}

export function cssStyleMenuSubMenuCustomIconActiveColor({ v, device, store }) {
  return cssStyleCustomIconColor({
    v,
    device,
    store,
    state: ACTIVE,
    prefix: "subMenuColor"
  });
}

// Dropdown Open / Close
export function cssStyleElementMenuDropdown({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "vertical" && (device === TABLET || device === MOBILE)) {
    return `${cssStylePositionRelative()} top: auto; left: auto; transform: translate(0, 0); height: 0; overflow: hidden;`;
  }
}

export function cssStyleElementMenuInnerDropdown({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal" && (device === TABLET || device === MOBILE)) {
    return `${cssStylePositionRelative()} top: auto; left: auto; transform: translate(0, 0); height: 0; overflow: hidden;`;
  }
}

export function cssStyleElementMenuDropdownOpened({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "vertical" && (device === TABLET || device === MOBILE)) {
    return "height: auto; width: 100%; left: auto; right: auto;";
  }
}

export function cssStyleElementMenuDropdownInnerOpened({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal" && (device === TABLET || device === MOBILE)) {
    return "height: auto; width: 100%; left: auto; right: auto;";
  }
}

export function cssStyleElementMenuDropdownArrow({ device }) {
  if (device === TABLET || device === MOBILE) {
    return "border-right-style: solid; border-left-style: none;";
  }
}

// Dropdown Position
export function cssStyleMenuDropdownPosition() {
  return `${cssStylePositionAbsolute()} top: 0; width: 305px;`;
}

export function cssStyleMenuDropdownPositionLeft({ device }) {
  if (device !== DESKTOP) {
    return "";
  }

  return "right: calc(100% + 5px);";
}

export function cssStyleMenuDropdownPositionRight({ device }) {
  if (device !== DESKTOP) {
    return "";
  }

  return "left: calc(100% + 5px);";
}

// First Dropdown Position
export function cssStyleMenuFirstDropdownPosition({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "top: calc(100% + 5px); width: 300px;";
  } else {
    return "top: 0; width: 300px;";
  }
}

export function cssStyleMenuFirstDropdownPositionLeft({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "right: 0;";
  } else {
    return "right: calc(100% + 5px);";
  }
}

export function cssStyleMenuFirstDropdownPositionRight({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "left: 0;";
  } else {
    return "left: calc(100% + 5px);";
  }
}

export function cssStyleElementMenuHamburgerBgImage({
  v,
  device,
  state,
  store,
  renderContext
}) {
  const dvv = (key) => defaultValueValue({ key, v, device, state });
  const bgPopulation = dvv("bgPopulation");

  if (bgPopulation && isEditor(renderContext)) {
    return cssStyleElementMMenuDynamicImage({ v, device, state });
  }

  return cssStyleBgImage({ v, device, state, store, renderContext });
}

export function cssStyleMenuCustomIconColor({ v, device, store, state }) {
  return cssStyleCustomIconColor({
    v,
    device,
    state,
    store,
    prefix: "mMenuColor"
  });
}

export function cssStyleMenuCustomIconActiveColor({ v, device, store }) {
  return cssStyleCustomIconColor({
    v,
    device,
    store,
    state: ACTIVE
  });
}

export function cssStyleElementMMenuIconActiveColor({ v, device, store }) {
  return cssStyleCustomIconColor({
    v,
    device,
    store,
    state: ACTIVE,
    prefix: "mMenuColor"
  });
}
