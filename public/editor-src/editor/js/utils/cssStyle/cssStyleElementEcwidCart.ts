import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "visual/utils/cssStyle";
import { styleAlignHorizontal } from "../style2/styleAlign";
import { checkValue } from "../checkValue";
import {
  cssStyleTypography2FontFamilyImportant,
  cssStyleTypography2FontSizeImportant,
  cssStyleTypography2FontWeightImportant,
  cssStyleTypography2LetterSpacingImportant,
  cssStyleTypography2LineHeightImportant
} from "./cssStyleTypography2";
import { cssStyleColorImportant } from "./cssStyleColor";
import { cssStyleBorderImportant } from "./cssStyleBorder";
import { cssStyleBoxShadowImportant } from "./cssStyleBoxShadow";
import { cssStyleBgColorImportant } from "./cssStyleBgColor";
import { cssStyleBgGradientImportant } from "./cssStyleBgGradient";

type BorderRadius = "square" | "rounded" | "custom";
const getBorderRadius = checkValue<BorderRadius>([
  "square",
  "rounded",
  "custom"
]);

// Style Footer
export function cssStyleElementEcwidCartFooterDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const footerDisplay = dvv("footerDisplay");

  if (footerDisplay === "off") {
    return "display: none;";
  } else return "display: flex;";
}

export function cssStyleElementEcwidCartSignInLinkDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const signInDisplay = dvv("signInDisplay");

  if (signInDisplay === "off") {
    return "display: none!important;";
  } else return "display: inline-block!important;";
}

export function cssStyleElementEcwidCartFooterTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "footer"
  });
}

export function cssStyleElementEcwidCartFooterTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "footer" });
}

export function cssStyleElementEcwidCartFooterTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "footer"
  });
}

export function cssStyleElementEcwidCartFooterTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "footer"
  });
}

export function cssStyleElementEcwidCartFooterTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "footer"
  });
}

export function cssStyleElementEcwidCartFooterColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "footerColor" });
}

// Style Title
export function cssStyleElementEcwidCartTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementEcwidCartTitleTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({ v, device, prefix: "title" });
}

export function cssStyleElementEcwidCartTitleTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "title" });
}

export function cssStyleElementEcwidCartTitleTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({ v, device, prefix: "title" });
}

export function cssStyleElementEcwidCartTitleTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({ v, device, prefix: "title" });
}

export function cssStyleElementEcwidCartTitleTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "title"
  });
}

export function cssStyleElementEcwidCartTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "title" });

  return align === undefined ? "" : `text-align:${align};`;
}

// Style Title2
export function cssStyleElementEcwidCartTitle2Color({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "title2Color" });
}

export function cssStyleElementEcwidCartTitle2Typography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "title2"
  });
}

export function cssStyleElementEcwidCartTitle2Typography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "title2" });
}

export function cssStyleElementEcwidCartTitle2Typography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "title2"
  });
}

export function cssStyleElementEcwidCartTitle2Typography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "title2"
  });
}

export function cssStyleElementEcwidCartTitle2Typography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "title2"
  });
}

export function cssStyleElementEcwidCartTitle2Align({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "title2" });

  return align === undefined ? "" : `text-align:${align};`;
}

// Style Subtitle
export function cssStyleElementEcwidCartSubtitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "subtitleColor" });
}

export function cssStyleElementEcwidCartSubtitleTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "subtitle"
  });
}

export function cssStyleElementEcwidCartSubtitleTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({
    v,
    device,
    prefix: "subtitle"
  });
}

export function cssStyleElementEcwidCartSubtitleTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "subtitle"
  });
}

export function cssStyleElementEcwidCartSubtitleTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "subtitle"
  });
}

export function cssStyleElementEcwidCartSubtitleTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "subtitle"
  });
}

export function cssStyleElementEcwidCartSubtitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "subtitle" });

  return align === undefined ? "" : `text-align:${align};`;
}

// Style Link
export function cssStyleElementEcwidCartLinkColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "linkColor" });
}

export function cssStyleElementEcwidCartLinkTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({ v, device, prefix: "link" });
}

export function cssStyleElementEcwidCartLinkTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "link" });
}

export function cssStyleElementEcwidCartLinkTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({ v, device, prefix: "link" });
}

export function cssStyleElementEcwidCartLinkTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({ v, device, prefix: "link" });
}

export function cssStyleElementEcwidCartLinkTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "link"
  });
}

export function cssStyleElementEcwidCartLinkAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "link" });

  return align === undefined ? "" : `text-align:${align}!important;`;
}

// Style button
export function cssStyleElementEcwidCartButtonTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "buttonColor" });
}

export function cssStyleElementEcwidCartButtonBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const buttonFillType = dvv("buttonFillType");

  if (buttonFillType === "outline" || buttonFillType === "default") {
    return "background: transparent!important;";
  }

  return cssStyleBgGradientImportant({ v, device, state });
}

export function cssStyleElementEcwidCartButtonSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const buttonHeight = dvv("buttonHeight");
  const buttonFillType = dvv("buttonFillType");

  if (buttonFillType === "default") {
    return "padding: 0!important";
  } else {
    return `padding: ${buttonHeight}px 0!important;`;
  }
}

export function cssStyleElementEcwidCartButtonBorderRadius({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const borderRadiusType = getBorderRadius(dvv("borderRadiusType"));
  const borderRadius = dvv("borderRadius");

  switch (borderRadiusType) {
    case "square":
      return "border-radius: 0!important;";
    case "rounded":
      return "border-radius: 500px!important;";
    case "custom":
      return `border-radius:${borderRadius}px!important;`;
    case undefined:
      return "";
  }
}

// Style Email
export function cssStyleElementEcwidCartEmailColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "emailColor" });
}

export function cssStyleElementEcwidCartEmailTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({ v, device, prefix: "email" });
}

export function cssStyleElementEcwidCartEmailTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "email" });
}

export function cssStyleElementEcwidCartEmailTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({ v, device, prefix: "email" });
}

export function cssStyleElementEcwidCartEmailTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({ v, device, prefix: "email" });
}

export function cssStyleElementEcwidCartEmailTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "email"
  });
}

export function cssStyleElementEcwidCartEmailAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "email" });

  return align === undefined ? "" : `text-align:${align}!important;`;
}

// Style Checkbox
export function cssStyleElementEcwidCartCheckboxColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "checkboxColor" });
}

export function cssStyleElementEcwidCartCheckboxTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidCartCheckboxTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({
    v,
    device,
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidCartCheckboxTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidCartCheckboxTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidCartCheckboxTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "checkbox"
  });
}

// Style Next
export function cssStyleElementEcwidCartNextColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "nextColor" });
}

export function cssStyleElementEcwidCartNextTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({ v, device, prefix: "next" });
}

export function cssStyleElementEcwidCartNextTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "next" });
}

export function cssStyleElementEcwidCartNextTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({ v, device, prefix: "next" });
}

export function cssStyleElementEcwidCartNextTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({ v, device, prefix: "next" });
}

export function cssStyleElementEcwidCartNextTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "next"
  });
}

export function cssStyleElementEcwidCartNextAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "next" });

  return align === undefined ? "" : `text-align:${align}!important;`;
}

// Style Payment
export function cssStyleElementEcwidCartPaymentColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "paymentColor" });
}

export function cssStyleElementEcwidCartPaymentTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "payment"
  });
}

export function cssStyleElementEcwidCartPaymentTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "payment" });
}

export function cssStyleElementEcwidCartPaymentTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "payment"
  });
}

export function cssStyleElementEcwidCartPaymentTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "payment"
  });
}

export function cssStyleElementEcwidCartPaymentTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "payment"
  });
}

export function cssStyleElementEcwidCartPaymentAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "payment" });

  return align === undefined ? "" : `text-align:${align}!important;`;
}

// Style Input
export function cssStyleElementEcwidCartInputColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({ v, device, state, prefix: "inputColor" });
}

export function cssStyleElementEcwidCartInputTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({ v, device, prefix: "input" });
}

export function cssStyleElementEcwidCartInputTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({ v, device, prefix: "input" });
}

export function cssStyleElementEcwidCartInputTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({ v, device, prefix: "input" });
}

export function cssStyleElementEcwidCartInputTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({ v, device, prefix: "input" });
}

export function cssStyleElementEcwidCartInputTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const inputHeight = dvv("inputHeight");
  const inputHeightSuffix = dvv("inputHeightSuffix");

  return `height: ${inputHeight}${inputHeightSuffix}!important;`;
}

export function cssStyleElementEcwidCartInputBorderRadius({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const inputBorderRadiusType = dvv("inputBorderRadiusType");
  const inputBorderRadius = dvv("inputBorderRadius");
  const inputBorderRadiusSuffix = dvv("inputBorderRadiusSuffix");
  const inputBorderTopLeftRadius = dvv("inputBorderTopLeftRadius");
  const inputBorderTopLeftRadiusSuffix = dvv("inputBorderTopLeftRadiusSuffix");
  const inputBorderTopRightRadius = dvv("inputBorderTopRightRadius");
  const inputBorderTopRightRadiusSuffix = dvv(
    "inputBorderTopRightRadiusSuffix"
  );
  const inputBorderBottomRightRadius = dvv("inputBorderBottomRightRadius");
  const inputBorderBottomRightRadiusSuffix = dvv(
    "inputBorderBottomRightRadiusSuffix"
  );
  const inputBorderBottomLeftRadius = dvv("inputBorderBottomLeftRadius");
  const inputBorderBottomLeftRadiusSuffix = dvv(
    "inputBorderBottomLeftRadiusSuffix"
  );

  if (inputBorderRadiusType !== "ungrouped") {
    return `border-radius: ${inputBorderRadius}${inputBorderRadiusSuffix}!important;`;
  }

  return `border-radius:${inputBorderTopLeftRadius}${inputBorderTopLeftRadiusSuffix} ${inputBorderTopRightRadius}${inputBorderTopRightRadiusSuffix} ${inputBorderBottomRightRadius}${inputBorderBottomRightRadiusSuffix} ${inputBorderBottomLeftRadius}${inputBorderBottomLeftRadiusSuffix}!important;`;
}

export function cssStyleElementEcwidCartInputBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColorImportant({ v, device, state, prefix: "inputBg" });
}

export function cssStyleElementEcwidCartInputBorderColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderImportant({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadowImportant({ v, device, state, prefix: "input" });
}

// Style Product Name
export function cssStyleElementEcwidCartProductNameColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({
    v,
    device,
    state,
    prefix: "productNameColor"
  });
}

export function cssStyleElementEcwidCartProductNameTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "productName"
  });
}

export function cssStyleElementEcwidCartProductNameTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({
    v,
    device,
    prefix: "productName"
  });
}

export function cssStyleElementEcwidCartProductNameTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "productName"
  });
}

export function cssStyleElementEcwidCartProductNameTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "productName"
  });
}

export function cssStyleElementEcwidCartProductNameTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "productName"
  });
}

export function cssStyleElementEcwidCartProductNameAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "productName"
  });

  return align === undefined ? "" : `text-align:${align};`;
}

// Style Product Size
export function cssStyleElementEcwidCartProductSizeColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColorImportant({
    v,
    device,
    state,
    prefix: "productSizeColor"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamilyImportant({
    v,
    device,
    prefix: "productSize"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSizeImportant({
    v,
    device,
    prefix: "productSize"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeightImportant({
    v,
    device,
    prefix: "productSize"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeightImportant({
    v,
    device,
    prefix: "productSize"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacingImportant({
    v,
    device,
    state,
    prefix: "productSize"
  });
}

export function cssStyleElementEcwidCartProductSizeAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "productSize"
  });

  return align === undefined ? "" : `text-align:${align};`;
}
