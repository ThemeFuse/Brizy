import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { ACTIVE } from "visual/utils/stateMode";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight,
  cssStyleColor,
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleFlexHorizontalAlign,
  cssStylePaddingFourFields,
  cssStyleBoxShadow,
  cssStylePadding
} from "visual/utils/cssStyle";
import {
  styleAlignHorizontal,
  styleBgColor,
  styleBorderColor,
  styleBorderStyle,
  styleBorderWidthGrouped,
  styleColor,
  styleElementMenuIconPosition,
  styleElementMenuIconSpacing,
  styleElementMenuIconSize,
  styleElementMenuMode,
  styleElementMMenu,
  styleElementMMenuIconSpacing,
  styleElementMMenuIconSize,
  styleElementMMenuIconPosition,
  styleElementMenuSubMenuIconPosition,
  styleElementMenuSubMenuIconSize,
  styleElementMenuSubMenuIconSpacing,
  styleTypography2LineHeight,
  styleTypography2FontSize,
  styleItemMarginTop,
  styleItemMarginRight,
  styleItemMarginBottom,
  styleItemMarginLeft,
  styleItemPaddingTop,
  styleItemPaddingRight,
  styleItemPaddingBottom,
  styleItemPaddingLeft,
  styleElementMMenuSize,
  styleElementMenuSize
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import { cssStyleFilter } from "./cssStyleFilter";
import { cssStyleBgGradient } from "./cssStyleBgGradient";

export function cssStyleElementMenuAlign({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });
  const mMenu = styleElementMMenu({ v, device, state });

  if (mode === "horizontal" || mMenu === "on") {
    return cssStyleFlexHorizontalAlign({ v, device, state });
  }

  const align = styleAlignHorizontal({ v, device, state });

  return `text-align: ${align};`;
}
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

export function cssStyleElementMenuIconSize({ v, device, state }) {
  const iconSize = styleElementMenuIconSize({ v, device, state });

  return `font-size: ${iconSize}px;`;
}

export function cssStyleElementMenuShowIcon({ v, device, state }) {
  const mMenu = styleElementMMenu({ v, device, state });
  const display = mMenu === "on" ? "flex" : "none";

  return `display: ${display};`;
}

export function cssStyleElementMenuShow({ v, device, state }) {
  const mMenu = styleElementMMenu({ v, device, state });
  const display = mMenu === "on" ? "none" : "flex";

  return `display: ${display};`;
}

export function cssStyleElementMenuMode({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return "display: flex; flex-wrap: wrap; justify-content: inherit; align-items: center;";
  }

  return "display: inline-block;";
}

export function cssStyleElementMenuSize({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "vertical") {
    const size = styleElementMenuSize({ v, device, state });

    return `max-width: ${size}%; width: 100%;`;
  }

  return "max-width: none;";
}

export function cssStyleElementMenuBgColor({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "vertical") {
    return cssStyleBgColor({ v, device, state, prefix: "menuBg" });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuLinkBgColor({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return cssStyleBgColor({ v, device, state, prefix: "menuBg" });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "menu" });
}

export function cssStyleElementMenuPadding({ v, device, state }) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "menu" });
}

export function cssStyleElementMenuActiveColor({ v, device }) {
  return cssStyleColor({ v, device, state: ACTIVE });
}

export function cssStyleElementMenuActiveLinkBgColor({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return cssStyleBgColor({ v, device, state: ACTIVE, prefix: "menuBg" });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuActiveBgColor({ v, device }) {
  return cssStyleBgColor({ v, device, state: ACTIVE, prefix: "menuBg" });
}

export function cssStyleElementMenuActiveBorder({ v, device }) {
  return cssStyleBorder({ v, device, state: ACTIVE, prefix: "menu" });
}

// Current
export function cssStyleElementMenuCurrentColor({ v, device }) {
  return cssStyleColor({ v, device, state: ACTIVE });
}

export function cssStyleElementMenuCurrentBgColor({ v, device }) {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    prefix: "menuBg"
  });
}

export function cssStyleElementMenuCurrentLinkBgColor({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal") {
    return cssStyleBgColor({ v, device, state: ACTIVE, prefix: "menuBg" });
  }

  return "background-color: transparent;";
}

export function cssStyleElementMenuCurrentBorder({ v, device }) {
  return cssStyleBorder({ v, device, state: ACTIVE, prefix: "menu" });
}

// MMenu
export function cssStyleElementMMenuSize({ v, device, state }) {
  const mMenuSize = styleElementMMenuSize({ v, device, state });

  return `font-size: ${mMenuSize}px;`;
}

export function cssStyleElementMMenuFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "mMenu" });
}

export function cssStyleElementMMenuFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "mMenu" });
}

export function cssStyleElementMMenuLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "mMenu" });
}

export function cssStyleElementMMenuFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "mMenu" });
}

export function cssStyleElementMMenuLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "mMenu" });
}

export function cssStyleElementMMenuColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "mMenuColor" });
}

export function cssStyleElementMMenuTitleColor({ v, device }) {
  return cssStyleColor({ v, device, prefix: "mMenuColor" });
}

export function cssStyleElementMMenuActiveColor({ v, device }) {
  return cssStyleColor({ v, device, state: ACTIVE, prefix: "mMenuColor" });
}

export function cssStyleElementMenuColor({ v, device, state }) {
  return cssStyleColor({ v, device, state });
}

export function cssStyleElementMMenuBorderColor({ v, device, state }) {
  const borderColor = styleBorderColor({ v, device, state, prefix: "mMenu" });

  return `border-color: ${borderColor};`;
}

export function cssStyleElementMMenuBackgroundColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "mMenuBg" });
}

export function cssStyleElementMMenuDynamicImage({ v, device, state }) {
  const bgPopulation = defaultValueValue({
    v,
    device,
    key: "bgPopulation",
    state
  });

  const bg = defaultValueValue({ v, key: "bg", device, state });

  return bgPopulation !== "" ? `background-image: url(${bg})` : "";
}

export function cssStyleElementMMenuImageFilter({ v, device, state }) {
  const imageSrc = defaultValueValue({ v, device, state, key: "bgImageSrc" });

  return imageSrc !== "" ? cssStyleFilter({ v, device, state }) : "";
}

export function cssStyleElementMMenuGradientBgColor({ v, state, device }) {
  return cssStyleBgGradient({ v, state, device, prefix: "mMenu" });
}

export function cssStyleElementMMenuItemHorizontalAlign({ v, device, state }) {
  const align = styleAlignHorizontal({ v, device, state, prefix: "mMenuItem" });
  const iconPosition = styleElementMMenuIconPosition({ v, device, state });
  const aligns =
    iconPosition === "left"
      ? {
          left: "flex-start",
          center: "center",
          right: "flex-end"
        }
      : {
          left: "flex-end",
          center: "center",
          right: "flex-start"
        };

  return `justify-content: ${aligns[align]};`;
}

export function cssStyleElementMMenuIconColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "mMenuIconColor" });
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
  const iconSize = styleElementMMenuIconSize({ v, device, state });

  return `font-size: ${iconSize}px;`;
}

export function cssStyleElementMMenuIconPosition({ v, device, state }) {
  const iconPosition = styleElementMMenuIconPosition({ v, device, state });

  return iconPosition === "right"
    ? "flex-flow: row-reverse nowrap;"
    : "flex-flow: row nowrap;";
}

export function cssStyleElementMMenuBtnNext({ v, device }) {
  const mMenuLineHeight = styleTypography2LineHeight({
    v,
    device,
    prefix: "mMenu"
  });
  const mMenuFontSize = styleTypography2FontSize({
    v,
    device,
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
  const typographyHeight =
    Math.round(mMenuLineHeight * mMenuFontSize * 10) / 10;
  const _paddingTop = `${paddingTop}${paddingTopSuffix}`;
  const _paddingBottom = `${paddingBottom}${paddingBottomSuffix}`;
  const height = `height: calc(${typographyHeight}px + ${_paddingTop} + ${_paddingBottom})`;

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
  const paddingTop = styleItemPaddingTop({ v, device });
  const paddingRight = styleItemPaddingRight({ v, device });
  const paddingBottom = styleItemPaddingBottom({ v, device });
  const paddingLeft = styleItemPaddingLeft({ v, device });

  if (mode === "horizontal") {
    return `padding-top:${paddingTop}; padding-bottom:${paddingBottom}; margin-right:${paddingRight}; margin-left:${paddingLeft};`;
  }

  return `margin-top:${paddingRight}; margin-bottom:${paddingLeft}; margin-right:0; margin-left:0;`;
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

// SubMenu
export function cssStyleElementMenuSubMenuFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "subMenu" });
}

export function cssStyleElementMenuSubMenuColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "subMenuColor" });
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

export function cssStyleElementMenuSubMenuIconSize({ v, device, state }) {
  const iconSize = styleElementMenuSubMenuIconSize({ v, device, state });

  return `font-size: ${iconSize}px;`;
}

export function cssStyleElementMenuSubMenuBgColor({ v, device, state }) {
  const bgColor = styleBgColor({ v, device, state, prefix: "subMenuBg" });

  return `background-color: ${bgColor};`;
}

export function cssStyleElementMenuSubMenuBorderColor({ v, device, state }) {
  const color = styleColor({ v, device, state, prefix: "subMenuColor" });

  return `border-color: ${color};`;
}

export function cssStyleElementMenuSubMenuBorderBottom({ v, device, state }) {
  const color = styleBorderColor({ v, device, state, prefix: "subMenu" });
  const style = styleBorderStyle({ v, device, state, prefix: "subMenu" });
  const width = styleBorderWidthGrouped({
    v,
    device,
    state,
    prefix: "subMenu"
  });

  return `border-bottom: ${width}px ${style} ${color};`;
}

// SubMenu Current
export function cssStyleElementMenuSubMenuCurrentColor({ v, device }) {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    prefix: "subMenuColor"
  });
}

export function cssStyleElementMenuSubMenuCurrentBgColor({ v, device }) {
  const bgColor = styleBgColor({
    v,
    device,
    state: ACTIVE,
    prefix: "subMenuBg"
  });

  return `background-color: ${bgColor};`;
}

export function cssStyleElementMenuSubMenuCurrentBoxShadow({ v, device }) {
  return cssStyleBoxShadow({ v, device, state: ACTIVE });
}

// Dropdown Open / Close
export function cssStyleElementMenuDropdown({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "vertical" && (device === TABLET || device === MOBILE)) {
    return "position: relative;top: auto; left: auto; transform: translate(0, 0); height: 0; overflow: hidden;";
  }
}

export function cssStyleElementMenuInnerDropdown({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  if (mode === "horizontal" && (device === TABLET || device === MOBILE)) {
    return "position: relative;top: auto; left: auto; transform: translate(0, 0); height: 0; overflow: hidden;";
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
  return "position: absolute; top: 0; width: 305px;";
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
