import { defaultValueValue } from "visual/utils/onChange";
import {
  styleBgColor,
  styleBorderWidthGrouped,
  styleBorderColor
} from "visual/utils/style2";
import { cssStylePaddingFourFields } from "visual/utils/cssStyle/cssStylePadding";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";

export function cssStyleElementTabsItemsBorderWidth({ v, device, state }) {
  return `border-width: ${styleBorderWidthGrouped({ v, device, state })}px;`;
}

export function cssStyleElementTabsBtnSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
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

export function cssStyleElementTabsBtnIconSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const iconCustomSize = dvv("iconCustomSize");
  return `font-size: ${iconCustomSize}px;`;
}

export function cssStyleElementTabsBtnActiveBorderBottomColor({
  v,
  device,
  state
}) {
  return `border-bottom-color: ${styleBgColor({
    v,
    device,
    state
  })} !important;`;
}
export function cssStyleElementTabsBtnActiveBorderRightColor({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const bgColorHex = dvv("bgColorHex");
  return `border-right-color: ${bgColorHex};`;
}
export function cssStyleElementTabsBtnActiveBorderLeftColor({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const bgColorHex = dvv("bgColorHex");
  return `border-left-color: ${bgColorHex};`;
}

export function cssStyleElementTabsActiveBeforeAfterColor({
  v,
  device,
  state
}) {
  return `background-color: ${styleBorderColor({
    v,
    device,
    state
  })}; z-index: 1;`;
}

export function cssStyleElementTabsActiveBeforeHeight({ v, device, state }) {
  return `height: ${styleBorderWidthGrouped({ v, device, state })}px;`;
}

export function cssStyleElementTabsActiveBeforeWidth({ v, device, state }) {
  return `width: ${styleBorderWidthGrouped({ v, device, state })}px;`;
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

export function cssStyleElementTabsBorderColor({ v, device, state }) {
  return `border-color: ${styleBorderColor({ v, device, state })};`;
}

export function cssStyleElementTabsBorderWidth({ v, device, state }) {
  return `border-width: ${styleBorderWidthGrouped({ v, device, state })}px;`;
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
  const dvv = key => defaultValueValue({ v, key, device, state });
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
  const dvv = key => defaultValueValue({ v, key, device, state });
  const justifyContent =
    dvv("iconPosition") === "left" ? "flex-start" : "flex-end";
  return `justify-content: ${justifyContent};`;
}
export function cssStyleElementTabsBeforeAfterTop({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const borderWidth = dvv("borderWidth");
  return `top: calc(100% - ${borderWidth}px);`;
}
export function cssStyleElementTabsBeforeAfterBottom({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const borderWidth = dvv("borderWidth");
  return `bottom: calc(100% - ${borderWidth}px);`;
}
export function cssStyleElementTabsAfterSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const spacingAfter = dvv("spacingAfter");
  return `margin-bottom: ${spacingAfter}px;`;
}
export function cssStyleElementTabsAfterSpacingVertical({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const spacingAfter = dvv("spacingAfter");
  const verticalAlign = dvv("verticalAlign");
  return verticalAlign === "left"
    ? `margin: 0 ${spacingAfter}px 0 0;`
    : `margin: 0 0 0 ${spacingAfter}px;`;
}
export function cssStyleElementTabsSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const spacing = dvv("spacing");
  const verticalMode = dvv("verticalMode");
  return verticalMode === "off"
    ? `margin: 0 ${spacing}px 0 0;`
    : `margin: 0 0 ${spacing}px 0;`;
}
export function cssStyleElementTabsNavAlign({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const horizontalAlign = dvv("horizontalAlign");

  const aligns = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  return horizontalAlign === "justify"
    ? "flex-grow: 1;"
    : `justify-content:${aligns[horizontalAlign]};`;
}
export function cssStyleElementTabsPadding({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const navStyle = dvv("navStyle");
  if (navStyle !== "style-3") {
    return cssStylePaddingFourFields({ v, device, state });
  }
  return "";
}
export function cssStyleElementTabsNavBorderBottom({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const verticalMode = dvv("verticalMode");
  const verticalAlign = dvv("verticalAlign");
  const color = styleBorderColor({ v, device, state });
  let width = styleBorderWidthGrouped({ v, device, state });

  if (verticalMode === "off") {
    if (width === 0) {
      width = 1;
    }
    return `content: ""; width: 100vw; height: ${width}px;  background-color: ${color}; position: absolute; top: auto; bottom: 0; z-index: 1;`;
  } else if (verticalMode === "on") {
    if (verticalAlign === "left") {
      return `content: ""; width: ${width}px; height: 100vh;  background-color: ${color}; top: auto; left: auto; right: 0; `;
    } else if (verticalAlign === "right") {
      return `content: ""; width: ${width}px; height: 100vh;  background-color: ${color}; top: auto; left: 0; right: auto; `;
    }
  }
}
export function cssStyleElementTabsNavStyle3Before({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const verticalMode = dvv("verticalMode");
  const verticalAlign = dvv("verticalAlign");
  const color = styleBorderColor({ v, device, state, prefix: "active" });
  const width = styleBorderWidthGrouped({ v, device, state, prefix: "active" });

  if (verticalMode === "off") {
    return `content: ""; width: 100%; height: ${width}px;  background-color: ${color}; position: absolute; bottom: 0px; left: 0; z-index: 2;`;
  } else if (verticalMode === "on") {
    if (verticalAlign === "left") {
      return `content: ""; width: ${width}px; height: 100%; background-color: ${color}; position: absolute; right: 0; left: auto; z-index: 2;`;
    } else if (verticalAlign === "right") {
      return `content: ""; width: ${width}px; height: 100%; background-color: ${color}; position: absolute; right: auto; left: 0; z-index: 2;`;
    }
  }
}

export function cssStyleElementTabsActiveColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "activeColor" });
}

export function cssStyleElementTabsActiveBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "activeBg" });
}

export function cssStyleElementTabsActiveShadow({ v, device, state }) {
  return cssStyleBoxShadow({ v, device, state, prefix: "active" });
}

export function cssStyleElementTabsActiveBorderColor({ v, device, state }) {
  return `border-color: ${styleBorderColor({
    v,
    device,
    state,
    prefix: "active"
  })};`;
}
