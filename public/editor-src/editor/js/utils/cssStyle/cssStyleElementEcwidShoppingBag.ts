import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { CSSValue } from "../style2/types";
import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontSizeSuffix,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "../style2/styleTypography2";
import { defaultValueValue } from "../onChange/device";
import { styleBgColor, styleColor } from "visual/utils/style";
import { cssStyleBgGradient } from "./cssStyleBgGradient";

export function cssStyleElementEcwidShoppingBagColor({
  v,
  device,
  state
}: CSSValue): string {
  return `stroke: ${styleColor({
    v,
    device,
    state,
    prefix: "color"
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagBgColor({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = dvv("fillType");

  if (fillType === "outline") {
    return "background: transparent;";
  } else if (fillType === "default") {
    return "border: 0!important; background: transparent; box-shadow: initial;";
  }

  return cssStyleBgColor({ v, device, state, prefix: "bg" });
}

export function cssStyleElementEcwidShoppingBagBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = dvv("fillType");

  if (fillType === "outline" || fillType === "default") {
    return "background: transparent;";
  }

  return cssStyleBgGradient({ v, device, state, prefix: "" });
}

export function cssStyleElementEcwidShoppingBagTypography2FontFamily({
  v,
  device,
  state
}: CSSValue): string {
  return `font-family:${styleTypography2FontFamily({
    v,
    device,
    state
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagTypography2FontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    state
  });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, state });

  return `font-size:${fontSize}${fontSizeSuffix}!important;`;
}

export function cssStyleElementEcwidShoppingBagTypography2LineHeight({
  v,
  device,
  state
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagTypography2FontWeight({
  v,
  device,
  state
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagBorderRadius({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const borderRadiusType = dvv("borderRadiusType");
  const borderRadius = dvv("borderRadius");
  const borderRadiusSuffix = dvv("borderRadiusSuffix");

  return borderRadiusType === "square"
    ? "border-radius: 0;"
    : borderRadiusType === "rounded"
    ? "border-radius: 100px;"
    : `border-radius: ${borderRadius}${borderRadiusSuffix};`;
}

export function cssStyleElementEcwidShoppingBagSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const size = dvv("size");
  const customSize = dvv("customSize");
  const customSizeSuffix = dvv("customSizeSuffix");

  return size === "small"
    ? "width: 16px!important; height: 16px!important;"
    : size === "medium"
    ? "width: 24px!important; height: 24px!important;"
    : size === "large"
    ? "width: 32px!important; height: 32px!important;"
    : `width: ${customSize}${customSizeSuffix}!important; height: ${customSize}${customSizeSuffix}!important;`;
}

export function cssStyleElementEcwidShoppingBagIconPositionTop({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const iconPositionTop = dvv("iconPositionTop");
  const iconPositionTopSuffix = dvv("iconPositionTopSuffix");

  return `top: ${iconPositionTop}${iconPositionTopSuffix}!important;`;
}

export function cssStyleElementEcwidShoppingBagIconPositionLeft({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const iconPositionLeft = dvv("iconPositionLeft");
  const iconPositionLeftSuffix = dvv("iconPositionLeftSuffix");

  return `left: ${iconPositionLeft}${iconPositionLeftSuffix}!important;`;
}

export function cssStyleElementEcwidShoppingBagIconPadding({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const iconPadding = dvv("iconPadding");
  const iconPaddingSuffix = dvv("iconPaddingSuffix");

  return `padding: ${iconPadding}${iconPaddingSuffix}!important; width: ${iconPadding}${iconPaddingSuffix}; height: ${iconPadding}${iconPaddingSuffix}!important;`;
}

export function cssStyleElementEcwidShoppingBagIconBorderRadius({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const iconBorderRadiusType = dvv("iconBorderRadiusType");
  const iconBorderRadius = dvv("iconBorderRadius");
  const iconBorderRadiusSuffix = dvv("iconBorderRadiusSuffix");

  return iconBorderRadiusType === "square"
    ? "border-radius: 0!important;"
    : iconBorderRadiusType === "rounded"
    ? "border-radius: 100px!important;"
    : `border-radius: ${iconBorderRadius}${iconBorderRadiusSuffix}!important;`;
}

export function cssStyleElementEcwidShoppingBagPropertyHoverTransition(): string {
  return "transition-property: color, background, border, box-shadow;";
}

export function cssStyleElementEcwidShoppingBagIconColor({
  v,
  device,
  state
}: CSSValue): string {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix: "iconColor"
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagIconBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return `background: ${styleBgColor({
    v,
    device,
    state,
    prefix: "iconBg"
  })}!important;`;
}

export function cssStyleElementEcwidShoppingBagIconBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "icon" });
}

export function cssStyleElementEcwidShoppingBagIconBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "icon" });
}

export function cssStyleElementEcwidShoppingBagPadding({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const padding = dvv("padding");
  const paddingSuffix = dvv("paddingSuffix");

  const fillType = dvv("fillType");

  if (fillType === "default") {
    return "padding: 0;";
  }

  return `padding: ${padding}${paddingSuffix};`;
}
