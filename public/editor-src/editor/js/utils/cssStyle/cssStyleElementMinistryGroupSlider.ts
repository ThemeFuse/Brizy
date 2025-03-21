import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
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
import {
  cssStyleElementMinistryBrandsButtonsBgColor,
  cssStyleElementMinistryBrandsButtonsBgGradient,
  cssStyleElementOfMinistryBrandsSpacing
} from "./cssStyleElementMinistryBrands";

export function cssStyleElementMinistryGroupSliderTitleSpacing({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "title",
    direction: "bottom"
  });
}

export function cssStyleElementMinistryGroupSliderMetaTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "metaTypography",
    renderContext
  });
}

export function cssStyleElementMinistryGroupSliderMetaSpacing({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleElementOfMinistryBrandsSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "meta"
  });
}

export function cssStyleElementMinistryGroupSliderPreviewSpacing({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "preview",
    direction: "bottom"
  });
}

export function cssStyleElementMinistryGroupSliderImageWidth({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementMinistryGroupSliderImageBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementMinistryGroupSliderImageBorderRadius({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementMinistryGroupSliderImageBoxShadow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementMinistryGroupSliderImageSpacing({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "image",
    direction: "bottom"
  });
}

export function cssStyleElementMinistryGroupSliderArrowSize({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeFontSizeIcon({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrow"
  });
}

export function cssStyleElementMinistryGroupSliderArrowSpacingLeft({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStylePositionElement({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrow",
    direction: "left"
  });
}

export function cssStyleElementMinistryGroupSliderArrowSpacingRight({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStylePositionElement({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrow",
    direction: "right"
  });
}

export function cssStyleElementMinistryGroupSliderArrowColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrowColor"
  });
}

export function cssStyleElementMinistryGroupSliderItemsAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "items"
  });
}

export function cssStyleElementMinistryGroupSliderItemsImageAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleMarginAlign({
    v,
    device,
    state,
    store,
    getConfig,
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
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "buttonTypography",
    renderContext
  });
}

export function cssStyleElementMinistryGroupSliderButtonSize({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizePadding({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementMinistryGroupSliderButtonWidth({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementMinistryGroupSliderButtonColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "buttonColor"
  });
}

export function cssStyleElementMinistryGroupSliderButtonBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleElementMinistryBrandsButtonsBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementMinistryGroupSliderButtonBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleElementMinistryBrandsButtonsBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementMinistryGroupSliderButtonBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementMinistryGroupSliderButtonBoxShadow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementMinistryGroupSliderDotsColorColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "dotsBg"
  });
}

export function cssStyleElementMinistryGroupSliderDotsColorColorActive({
  v,
  device,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "dotsBg"
  });
}
