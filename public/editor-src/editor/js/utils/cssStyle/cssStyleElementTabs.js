import { defaultValueValue } from "visual/utils/onChange";
import { styleBgColor, styleBorderWidthGrouped } from "visual/utils/style2";
import { styleBorderColor } from "visual/utils/style";

export function cssStyleElementTabsItemsBorderWidth({ v, device, state }) {
  return `border-width: ${styleBorderWidthGrouped({ v, device, state })}px;`;
}

export function cssStyleElementTabsBtnSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  const iconSpacing = dvv("iconSpacing");
  return iconPosition === "left"
    ? `margin: 0 ${iconSpacing}px 0 0;`
    : `margin: 0 0 0 ${iconSpacing}px;`;
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
  const iconPosition = dvv("iconPosition") === "left" ? "row" : "row-reverse";
  return `flex-direction: ${iconPosition};`;
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
