import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";
import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontSizeSuffix,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "../style2/styleTypography2";
import { styleColor } from "../style/styleColor";
import { cssStyleColor } from "visual/utils/cssStyle";
import { styleAlignHorizontal } from "../style2/styleAlign";
import { styleBgColor } from "../style2";
import {
  styleBorderStyle,
  styleBorderColor,
  styleBorderWidthUngrouped,
  styleBoxShadowType,
  styleBoxShadowColor,
  styleBoxShadowHorizontal,
  styleBoxShadowVertical,
  styleBoxShadowBlur,
  styleBoxShadowSpread
} from "visual/utils/style2";

// Style Footer
export function cssStyleElementEcwidMyAccountFooterDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const footerDisplay = dvv("footerDisplay");

  if (footerDisplay === "off") {
    return "display: none;";
  } else return "display: flex;";
}

export function cssStyleElementEcwidMyAccountSignInLinkDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const signInDisplay = dvv("signInDisplay");

  if (signInDisplay === "off") {
    return "display: none!important;";
  } else return "display: inline-block!important;";
}

export function cssStyleElementEcwidMyAccountFooterTypography2FontFamily({
  v,
  device,
  state
}: CSSValue): string {
  return `font-family:${styleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "footer"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountFooterTypography2FontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    state,
    prefix: "footer"
  });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, state });

  return `font-size:${fontSize}${fontSizeSuffix || "px"}!important;`;
}

export function cssStyleElementEcwidMyAccountFooterTypography2LineHeight({
  v,
  device,
  state
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "footer"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountFooterTypography2FontWeight({
  v,
  device,
  state
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "footer"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountFooterTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "footer"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountFooterColor({
  v,
  device,
  state
}: CSSValue): string {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix: "footerColor"
  })}!important;`;
}

// Style Title
export function cssStyleElementEcwidMyAccountTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementEcwidMyAccountTitleTypography2FontFamily({
  v,
  device,
  state
}: CSSValue): string {
  return `font-family:${styleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "title"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountTitleTypography2FontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    state,
    prefix: "title"
  });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, state });

  return `font-size:${fontSize}${fontSizeSuffix || "px"}!important;`;
}

export function cssStyleElementEcwidMyAccountTitleTypography2LineHeight({
  v,
  device,
  state
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "title"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountTitleTypography2FontWeight({
  v,
  device,
  state
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "title"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountTitleTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state
  })}`;
}

export function cssStyleElementEcwidMyAccountTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix: "title" });

  return align === undefined ? "" : `text-align:${align};`;
}

// Style Description
export function cssStyleElementEcwidMyAccountDescriptionColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "descriptionColor" });
}

export function cssStyleElementEcwidMyAccountDescriptionTypography2FontFamily({
  v,
  device,
  state
}: CSSValue): string {
  return `font-family:${styleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "description"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountDescriptionTypography2FontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    state,
    prefix: "description"
  });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, state });

  return `font-size:${fontSize}${fontSizeSuffix || "px"}!important;`;
}

export function cssStyleElementEcwidMyAccountDescriptionTypography2LineHeight({
  v,
  device,
  state
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "description"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountDescriptionTypography2FontWeight({
  v,
  device,
  state
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "description"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountDescriptionTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state
  })}`;
}

export function cssStyleElementEcwidMyAccountDescriptionAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "description"
  });

  return align === undefined ? "" : `text-align:${align};`;
}

// Style Input
export function cssStyleElementEcwidMyAccountInputColor({
  v,
  device,
  state
}: CSSValue): string {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix: "inputColor"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountInputTypography2FontFamily({
  v,
  device,
  state
}: CSSValue): string {
  return `font-family:${styleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "input"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountInputTypography2FontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    state,
    prefix: "input"
  });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, state });

  return `font-size:${fontSize}${fontSizeSuffix || "px"}!important;`;
}

export function cssStyleElementEcwidMyAccountInputTypography2LineHeight({
  v,
  device,
  state
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "input"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountInputTypography2FontWeight({
  v,
  device,
  state
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "input"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountInputTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "input"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountInputSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const inputSize = dvv("inputSize");

  if (inputSize === "small") {
    return "padding: 20px!important;";
  } else if (inputSize === "medium") {
    return "padding: 30px!important;";
  } else if (inputSize === "large") {
    return "padding: 40px!important;";
  } else return "";
}

export function cssStyleElementEcwidMyAccountInputBorderRadius({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const inputBorderRadius = dvv("inputBorderRadius");

  return `border-radius:${inputBorderRadius}px!important;`;
}

export function cssStyleElementEcwidMyAccountInputBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return `background: ${styleBgColor({
    v,
    device,
    state,
    prefix: "inputBg"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountInputBorderColor({
  v,
  device,
  state,
  prefix = "input"
}: CSSValue): string {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix
  });
  const borderStyle = styleBorderStyle({
    v,
    device,
    state,
    prefix
  });
  const borderColor = styleBorderColor({
    v,
    device,
    state,
    prefix
  });

  return borderWidth === undefined
    ? ""
    : `border:${borderWidth}px ${borderStyle} ${borderColor}!important;`;
}

export function cssStyleElementEcwidMyAccountInputBoxShadow({
  v,
  device,
  state,
  prefix = "input"
}: CSSValue): string {
  const type = styleBoxShadowType({ v, device, state, prefix });
  const color = styleBoxShadowColor({ v, device, state, prefix });
  const blur = styleBoxShadowBlur({ v, device, state, prefix });
  const spread = styleBoxShadowSpread({ v, device, state, prefix });
  const horizontal =
    type === "inset"
      ? styleBoxShadowHorizontal({ v, device, state, prefix }) * -1
      : styleBoxShadowHorizontal({ v, device, state, prefix });
  const vertical =
    type === "inset"
      ? styleBoxShadowVertical({ v, device, state, prefix }) * -1
      : styleBoxShadowVertical({ v, device, state, prefix });

  if (
    type === "" ||
    type === "off" ||
    (horizontal === 0 && vertical === 0 && blur === 0 && spread === 0)
  ) {
    return "";
  } else {
    const inset = type === "inset" ? "inset " : "";

    return `box-shadow: ${inset}${horizontal}px ${vertical}px ${blur}px ${spread}px ${color}!important;`;
  }
}

// Style Agreement
export function cssStyleElementEcwidMyAccountAgreementColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "agreementColor" });
}

export function cssStyleElementEcwidMyAccountAgreementTypography2FontFamily({
  v,
  device,
  state
}: CSSValue): string {
  return `font-family:${styleTypography2FontFamily({
    v,
    device,
    state,
    prefix: "agreement"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountAgreementTypography2FontSize({
  v,
  device,
  state
}: CSSValue): string {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    state,
    prefix: "agreement"
  });
  const fontSizeSuffix = styleTypography2FontSizeSuffix({ v, device, state });

  return `font-size:${fontSize}${fontSizeSuffix || "px"}!important;`;
}

export function cssStyleElementEcwidMyAccountAgreementTypography2LineHeight({
  v,
  device,
  state
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix: "agreement"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountAgreementTypography2FontWeight({
  v,
  device,
  state
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix: "agreement"
  })}!important;`;
}

export function cssStyleElementEcwidMyAccountAgreementTypography2LetterSpacing({
  v,
  device,
  state,
  prefix = "agreement"
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  })}`;
}

export function cssStyleElementEcwidMyAccountAgreementAlign({
  v,
  device,
  state
}: CSSValue): string {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "agreement"
  });

  return align === undefined ? "" : `text-align:${align};`;
}
