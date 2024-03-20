import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleElementOfMinistryBrandsSpacing,
  cssStyleMarginAlign,
  cssStylePositionElement,
  cssStyleSizeFontSizeIcon,
  cssStyleSizePadding,
  cssStyleSizeWidth,
  cssStyleSpacing,
  cssStyleTextAlign,
  getAllCssStyleTypography
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { ACTIVE } from "../stateMode";

export function cssStyleElementMinistryGroupSliderTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "title",
    direction: "bottom"
  });
}

export function cssStyleElementMinistryGroupSliderMetaTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "metaTypography"
  });
}

export function cssStyleElementMinistryGroupSliderMetaSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleElementOfMinistryBrandsSpacing({
    v,
    device,
    state,
    prefix: "meta"
  });
}

export function cssStyleElementMinistryGroupSliderPreviewSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "preview",
    direction: "bottom"
  });
}

export function cssStyleElementMinistryGroupSliderImageWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "image" });
}

export function cssStyleElementMinistryGroupSliderImageBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "image" });
}

export function cssStyleElementMinistryGroupSliderImageBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "image" });
}

export function cssStyleElementMinistryGroupSliderImageBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "image" });
}

export function cssStyleElementMinistryGroupSliderImageSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "image",
    direction: "bottom"
  });
}

export function cssStyleElementMinistryGroupSliderArrowSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeFontSizeIcon({
    v,
    device,
    state,
    prefix: "arrow"
  });
}

export function cssStyleElementMinistryGroupSliderArrowSpacingLeft({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePositionElement({
    v,
    device,
    state,
    prefix: "arrow",
    direction: "left"
  });
}

export function cssStyleElementMinistryGroupSliderArrowSpacingRight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePositionElement({
    v,
    device,
    state,
    prefix: "arrow",
    direction: "right"
  });
}

export function cssStyleElementMinistryGroupSliderArrowColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "arrowColor"
  });
}

export function cssStyleElementMinistryGroupSliderItemsAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "items"
  });
}

export function cssStyleElementMinistryGroupSliderItemsImageAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMarginAlign({
    v,
    device,
    state,
    prefix: "items"
  });
}

export function cssStyleElementMinistryGroupSliderItemsBetween({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const between = dvv("itemsBetween");
  const suffix = dvv("itemsBetweenSuffix");

  return `padding: 0 ${between}${suffix};`;
}

export function cssStyleElementMinistryGroupSliderSlidesToShow({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const slides = dvv("slidesToShow");

  return slides === undefined ? "" : `flex-basis:${100 / slides}%;`;
}

export function cssStyleElementMinistryGroupSliderButtonTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementMinistryGroupSliderButtonSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "button" });
}

export function cssStyleElementMinistryGroupSliderButtonWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "button" });
}

export function cssStyleElementMinistryGroupSliderButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "buttonColor" });
}

export function cssStyleElementMinistryGroupSliderButtonBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "buttonBg" });
}

export function cssStyleElementMinistryGroupSliderButtonBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "button" });
}

export function cssStyleElementMinistryGroupSliderButtonBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "button" });
}

export function cssStyleElementMinistryGroupSliderButtonBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "button" });
}

export function cssStyleElementMinistryGroupSliderButtonBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "button" });
}

export function cssStyleElementMinistryGroupSliderDotsColorColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "dotsBg" });
}

export function cssStyleElementMinistryGroupSliderDotsColorColorActive({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    prefix: "dotsBg"
  });
}
