import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  cssStyleBoxShadow,
  cssStyleColor,
  cssStylePaddingFourFields,
  cssStyleTextShadow2,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import {
  styleAlignHorizontal,
  styleBgColor,
  styleColor
} from "visual/utils/style2";
import { readIconSize } from "visual/utils/types/Type";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleAlertContainerShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "container" });
}

//#region close button
export function cssStyleElementAlertCloseButtonVisibility({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const closeButtonState = dvv("closeButtonState");
  return `display:${closeButtonState === "off" ? "none" : "block"};`;
}

export function cssStyleElementAlertCloseButtonSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const closeSize = dvv("closeSize");
  const closeCustomSize = dvv("closeCustomSize");

  switch (readIconSize(closeSize)) {
    case "small": {
      return "font-size: 16px;";
    }
    case "medium": {
      return "font-size: 24px;";
    }
    case "large": {
      return "font-size: 32px;";
    }
    case "custom": {
      return `font-size: ${closeCustomSize}px;`;
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementAlertCloseButtonBgSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const closeBgSize = dvv("closeBgSize");

  return `padding:${closeBgSize}px;`;
}

export function cssStyleElementAlertCloseButtonBgColor({
  v,
  device,
  state
}: CSSValue): string {
  const closeBgColor = styleBgColor({
    v,
    device,
    prefix: "closeBg",
    state
  });

  return closeBgColor ? `background-color:${closeBgColor};` : "";
}

export function cssStyleElementAlertCloseButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  const closeColor = styleColor({
    v,
    device,
    state,
    prefix: "closeColor"
  });

  return closeColor ? `color:${closeColor};` : "";
}

export function cssStyleElementAlertCloseButtonBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const closeBorderRadiusShape = dvv("closeBorderRadiusShape");
  const closeBorderRadius = dvv("closeBorderRadius");

  const radius =
    closeBorderRadiusShape === "square"
      ? 0
      : closeBorderRadiusShape === "rounded"
        ? 50
        : closeBorderRadius;

  return `border-radius:${radius}px;`;
}

export function cssStyleElementAlertCloseButtonPosition({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const closeHorizontalPosition = dvv("closeHorizontalPosition");
  const closeVerticalPosition = dvv("closeVerticalPosition");

  return `top:${closeVerticalPosition}px;right:${closeHorizontalPosition}px;`;
}

//#endregion

//#region title
export function cssStyleElementAlertTitleAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const contentAlign = styleAlignHorizontal({
    v,
    device,
    state,
    store,
    prefix: "title"
  });

  return contentAlign ? `text-align:${contentAlign};` : "";
}

export function cssStyleElementAlertTitleShadow({
  v,
  state,
  device
}: CSSValue): string {
  return cssStyleTextShadow2({ v, state, device, prefix: "title" });
}

export function cssStyleElementAlertTitleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "titleColor" });
}

export function cssStyleElementAlertTitleFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "title",
    renderContext
  });
}

export function cssStyleElementAlertTitleFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "title" });
}

export function cssStyleElementAlertTitleLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "title" });
}

export function cssStyleElementAlertTitleFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "title" });
}

export function cssStyleElementAlertTitleLetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "title"
  });
}

export function cssStyleElementAlertTitleFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "title"
  });
}

export function cssStyleElementAlertTitleTextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "title" });
}

//#endregion

//#region description
export function cssStyleElementAlertDescriptionVisibility({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const descriptionState = dvv("descriptionState");
  return `display:${descriptionState === "off" ? "none" : "block"};`;
}

export function cssStyleElementAlertDescriptionGap({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const gap = dvv("gap");
  const gapSuffix = dvv("gapSuffix");
  return `padding-top:${gap}${gapSuffix};`;
}

export function cssStyleAlertPadding({ v, device, state }: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "alert" });
}

export function cssStyleElementAlertDescriptionAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const contentAlign = styleAlignHorizontal({
    v,
    device,
    state,
    store,
    prefix: "description"
  });

  return contentAlign ? `text-align:${contentAlign};` : "";
}

export function cssStyleElementAlertDescriptionShadow({
  v,
  state,
  device
}: CSSValue): string {
  return cssStyleTextShadow2({ v, state, device, prefix: "description" });
}

export function cssStyleElementAlertDescriptionColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "descriptionColor" });
}

export function cssStyleElementAlertDescriptionFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "description",
    renderContext
  });
}

export function cssStyleElementAlertDescriptionFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    prefix: "description"
  });
}

export function cssStyleElementAlertDescriptionLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "description"
  });
}

export function cssStyleElementAlertDescriptionFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "description"
  });
}

export function cssStyleElementAlertDescriptionLetterSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    state,
    prefix: "description"
  });
}

export function cssStyleElementAlertDescriptionFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "description"
  });
}

export function cssStyleElementAlertDescriptionTextTransform({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    prefix: "description"
  });
}

//#endregion
