import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";

import { cssStyleColor } from "visual/utils/cssStyle";
import {
  styleTypographyElementCountdownLabelFontSize,
  styleElementCountdown2Spacing
} from "visual/utils/style2";

export function cssStyleTypographyElementCountdownLabelFontSize({ v, device }) {
  return `font-size:${styleTypographyElementCountdownLabelFontSize({
    v,
    device
  })};`;
}

export function cssStyleElementCountDown2SpacingLeft({ v, device }) {
  return `margin-left:${styleElementCountdown2Spacing({
    v,
    device
  })};`;
}

export function cssStyleElementCountDown2SpacingRight({ v, device }) {
  return `margin-right:${styleElementCountdown2Spacing({
    v,
    device
  })};`;
}

// Style Typography Number
export function cssStyleNumberTypography2FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "number" });
}

export function cssStyleNumberTypography2FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "number" });
}

export function cssStyleNumberTypography2LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "number" });
}

export function cssStyleNumberTypography2FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "number" });
}

export function cssStyleNumberTypography2LetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "number" });
}

// Style Typography Title
export function cssStyleTitleTypography2FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "title" });
}

export function cssStyleTitleTypography2FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "title" });
}

export function cssStyleTitleTypography2LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "title" });
}

export function cssStyleTitleTypography2FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "title" });
}

export function cssStyleTitleTypography2LetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "title" });
}

// Style Typography Message
export function cssStyleMessageTypography2FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "message" });
}

export function cssStyleMessageTypography2FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "message" });
}

export function cssStyleMessageTypography2LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "message" });
}

export function cssStyleMessageTypography2FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "message" });
}

export function cssStyleMessageTypography2LetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "message" });
}

// Color
export function cssStyleElementCountDown2NumberColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "numberColor" });
}

export function cssStyleElementCountDown2TitleColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementCountDown2MessageColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "messageColor" });
}

export function cssStyleElementCountDown2HoverTransitionProperty() {
  return "transition-property: color, background-color, border, box-shadow;";
}
