import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleCustomIconColor,
  cssStylePaddingFourFields,
  cssStyleSizeWidth
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import {
  styleAlignHorizontal,
  styleBgColor,
  styleBorderColor,
  styleBorderWidthGrouped
} from "visual/utils/style2";
import { ACTIVE } from "../stateMode";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";
import { cssStylePositionAbsolute } from "./cssStylePosition";

export function cssStyleElementTabsBtnSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  const iconSpacing = dvv("iconSpacing");
  switch (iconPosition) {
    case "left": {
      return `margin: 0 ${iconSpacing}px 0 0;`;
    }
    case "right": {
      return `margin: 0 0 0 ${iconSpacing}px;`;
    }
    case "top": {
      return `margin: 0 0 ${iconSpacing}px 0;`;
    }
    case "bottom": {
      return `margin: ${iconSpacing}px 0 0 0;`;
    }
  }
}

export function cssStyleElementTabsBtnActiveBorderBottomColor({
  v,
  store,
  getConfig
}) {
  const borderColor = styleBgColor({
    v,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "bg"
  });
  return `border-bottom-color: ${borderColor};`;
}

export function cssStyleElementTabsBtnActiveBorderRightColor({
  v,
  store,
  getConfig
}) {
  const borderColor = styleBgColor({
    v,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "bg"
  });
  return `border-right-color: ${borderColor};`;
}

export function cssStyleElementTabsBtnActiveBorderLeftColor({
  v,
  store,
  getConfig
}) {
  const borderColor = styleBgColor({
    v,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "bg"
  });
  return `border-left-color: ${borderColor};`;
}

export function cssStyleElementTabsActiveBeforeAfterColor({
  v,
  device,
  state,
  store,
  getConfig
}) {
  return `background-color: ${styleBorderColor({
    v,
    device,
    state,
    store,
    getConfig
  })}; z-index: 1;`;
}

export function cssStyleElementTabsActiveBeforeHeight({ v, device, state }) {
  return `height: ${styleBorderWidthGrouped({ v, device, state })}px;`;
}

export function cssStyleElementTabsActiveBeforeWidth({
  v,
  device,
  state,
  store,
  getConfig
}) {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "border"
  });
}

export function cssStyleElementTabsBeforeAfterRightWidth({ v, device, state }) {
  return `right: calc(-100vw + ${styleBorderWidthGrouped({
    v,
    device,
    state
  })}px);`;
}

export function cssStyleElementTabsBeforeAfterLeftWidth({ v, device, state }) {
  return `left: calc(-100vw + ${styleBorderWidthGrouped({
    v,
    device,
    state
  })}px);`;
}

export function cssStyleElementTabsBorderMobileWidth({ v, device, state }) {
  const wid = styleBorderWidthGrouped({ v, device, state });
  return `border-width: 0 0 ${wid}px 0;`;
}

export function cssStyleElementTabsEmptyContent({ v }) {
  return v.items.length === 0
    ? "border-top: 1px solid transparent; margin-top: -1px;"
    : "";
}

export function cssStyleElementTabsBtnIconPosition({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  switch (iconPosition) {
    case "left": {
      return "flex-direction: row;";
    }
    case "right": {
      return "flex-direction: row-reverse;";
    }
    case "top": {
      return "flex-direction: column;";
    }
    case "bottom": {
      return "flex-direction: column-reverse;";
    }
  }
}

export function cssStyleElementTabsBtnIconJustifyContent({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const justifyContent =
    dvv("iconPosition") === "left" ? "flex-start" : "flex-end";
  return `justify-content: ${justifyContent};`;
}
export function cssStyleElementTabsBeforeAfterTop({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const borderWidth = dvv("borderWidth");
  return `top: calc(100% - ${borderWidth}px);`;
}
export function cssStyleElementTabsBeforeAfterBottom({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const borderWidth = dvv("borderWidth");
  return `bottom: calc(100% - ${borderWidth}px);`;
}
export function cssStyleElementTabsAfterSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const spacingAfter = dvv("spacingAfter");
  return `margin-bottom: ${spacingAfter}px;`;
}
export function cssStyleElementTabsAfterSpacingVertical({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const spacingAfter = dvv("spacingAfter");
  const verticalAlign = dvv("verticalAlign");
  return verticalAlign === "left"
    ? `margin: 0 ${spacingAfter}px 0 0;`
    : `margin: 0 0 0 ${spacingAfter}px;`;
}
export function cssStyleElementTabsSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const spacing = dvv("spacing");
  const verticalMode = dvv("verticalMode");
  return verticalMode === "off"
    ? `margin: 0 ${spacing}px 0 0;`
    : `margin: 0 0 ${spacing}px 0;`;
}
export function cssStyleElementTabsNavAlign({
  v,
  device,
  state,
  store,
  getConfig
}) {
  const horizontalAlign = styleAlignHorizontal({
    v,
    device,
    state,
    store,
    getConfig
  });

  return horizontalAlign === "justify"
    ? "flex-grow: 1;"
    : cssStyleFlexHorizontalAlign({ v, device, state, store, getConfig });
}
export function cssStyleElementTabsPadding({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const navStyle = dvv("navStyle");
  if (navStyle !== "style-3") {
    return cssStylePaddingFourFields({ v, device, state });
  }
  return "";
}
export function cssStyleElementTabsNavBorderBottom({
  v,
  device,
  state,
  store,
  getConfig
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const verticalMode = dvv("verticalMode");
  const verticalAlign = dvv("verticalAlign");
  const color = styleBorderColor({ v, device, store, state, getConfig });
  let width = styleBorderWidthGrouped({ v, device, state });

  if (verticalMode === "off") {
    if (width === 0) {
      width = 1;
    }
    return `content: ""; width: 105vw; height: ${width}px;  background-color: ${color}; ${cssStylePositionAbsolute()} top: auto; bottom: 0; z-index: 1;`;
  } else if (verticalMode === "on") {
    if (verticalAlign === "left") {
      return `content: ""; width: ${width}px; height: 100vh;  background-color: ${color}; top: auto; left: auto; right: 0; `;
    } else if (verticalAlign === "right") {
      return `content: ""; width: ${width}px; height: 100vh;  background-color: ${color}; top: auto; left: 0; right: auto; `;
    }
  }
}
export function cssStyleElementTabsNavStyle3Before({
  v,
  device,
  state,
  store,
  getConfig
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const verticalMode = dvv("verticalMode");
  const verticalAlign = dvv("verticalAlign");
  const color = styleBorderColor({
    v,
    device,
    store,
    state: ACTIVE,
    getConfig
  });
  const width = styleBorderWidthGrouped({ v, device, state: ACTIVE });

  if (verticalMode === "off") {
    return `content: ""; width: 100%; height: ${width}px;  background-color: ${color}; ${cssStylePositionAbsolute()} bottom: 0; left: 0; z-index: 2;`;
  } else if (verticalMode === "on") {
    if (verticalAlign === "left") {
      return `content: ""; width: ${width}px; height: 100%; background-color: ${color}; ${cssStylePositionAbsolute()} right: 0; left: auto; z-index: 2;`;
    } else if (verticalAlign === "right") {
      return `content: ""; width: ${width}px; height: 100%; background-color: ${color}; ${cssStylePositionAbsolute()} right: auto; left: 0; z-index: 2;`;
    }
  }
}

export function cssStyleElementTabsActiveColor({ v, store, getConfig }) {
  return cssStyleColor({ v, state: ACTIVE, getConfig, prefix: "color", store });
}

export function cssStyleElementTabsActiveBgColor({ v, store, getConfig }) {
  return cssStyleBgColor({ v, state: ACTIVE, prefix: "bg", store, getConfig });
}

export function cssStyleElementTabsActiveShadow({ v, store, getConfig }) {
  return cssStyleBoxShadow({ v, state: ACTIVE, store, getConfig });
}

export function cssStyleElementTabsActiveBorder({
  v,
  device,
  store,
  getConfig
}) {
  return cssStyleBorder({ v, device, store, getConfig, state: "active" });
}

export function cssStyleElementTabsContentBgColor({
  v,
  device,
  state,
  store,
  getConfig
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const contentBgColorOpacity = dvv("contentBgColorOpacity");
  return contentBgColorOpacity === 0
    ? ""
    : cssStyleBgColor({
        v,
        device,
        state,
        store,
        getConfig,
        prefix: "contentBg"
      });
}

export function cssStyleElementTabsContentBorder({
  v,
  device,
  state,
  store,
  getConfig
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const contentBorderColorOpacity = dvv("contentBorderColorOpacity");
  return contentBorderColorOpacity === 0
    ? ""
    : cssStyleBorder({ v, device, state, store, getConfig, prefix: "content" });
}

export function cssStyleElementTabsContentShadow({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "content"
}) {
  return cssStyleBoxShadow({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementTabsBgColor({ v, device, store, getConfig }) {
  return cssStyleBgColor({ v, device, store, getConfig });
}

export function cssStyleElementTabsActiveCustomIconColor({
  v,
  store,
  getConfig,
  device
}) {
  return cssStyleCustomIconColor({
    v,
    device,
    state: ACTIVE,
    store,
    getConfig
  });
}
