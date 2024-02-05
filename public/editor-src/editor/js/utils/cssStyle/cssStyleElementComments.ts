import {
  cssStyleColor,
  cssStyleSizeFontSize,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import {
  styleBgColor,
  styleColor,
  styleTypography2FontSize,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementCommentsNameFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "name" });
}

export function cssStyleElementCommentsNameFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "name" });
}

export function cssStyleElementCommentsNameLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "name" });
}

export function cssStyleElementCommentsNameFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "name" });
}

export function cssStyleElementCommentsNameLetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "name" });
}

export function cssStyleElementCommentsNameFontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "name" });
}

export function cssStyleElementCommentsCommentFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "comment" });
}

export function cssStyleElementCommentsCommentFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "comment" });
}

export function cssStyleElementCommentsCommentLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "comment" });
}

export function cssStyleElementCommentsCommentFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "comment" });
}

export function cssStyleElementCommentsCommentLetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "comment"
  });
}

export function cssStyleElementCommentsCommentFontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "comment" });
}

export function cssStyleElementCommentsDateFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "date" });
}

export function cssStyleElementCommentsDateFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "date" });
}

export function cssStyleElementCommentsDateLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "date" });
}

export function cssStyleElementCommentsDateFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "date" });
}

export function cssStyleElementCommentsDateLetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "date" });
}

export function cssStyleElementCommentsDateFontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "date" });
}

export function cssStyleElementCommentsReplyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "reply" });
}

export function cssStyleElementCommentsReplyFontSize({
  v,
  device,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsReplyLineHeight({
  v,
  device,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsReplyFontWeight({
  v,
  device,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsReplyLetterSpacing({
  v,
  device,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsReplyFontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "reply" });
}

export function cssStyleElementCommentsPostButtonFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "postButton" });
}

export function cssStyleElementCommentsPostButtonFontSize({
  v,
  device,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsPostButtonLineHeight({
  v,
  device,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsPostButtonFontWeight({
  v,
  device,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsPostButtonLetterSpacing({
  v,
  device,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsPostButtonFontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "postButton" });
}

export function cssStyleElementCommentsLogoSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const size = dvv("logoSize");

  return `width: ${size}px !important; height: ${size}px;`;
}

export function cssStyleElementCommentsWidthContainer({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const size = dvv("logoSize");
  const margin = dvv("skin") === "skin3" ? 25 : 10;

  return `width: calc(100% - ${size + margin}px);`;
}

export function cssStyleElementCommentsPostButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "postButtonColor" });

  return color === undefined ? "" : `color:${color}!important;`;
}

export function cssStyleElementCommentsPostButtonBg({
  v,
  device,
  state
}: CSSValue): string {
  const bgColor = styleBgColor({ v, device, state, prefix: "postButtonBg" });

  return bgColor === undefined
    ? "background-color:transparent;"
    : `background-color:${bgColor}!important;`;
}

export function cssStyleElementCommentsColorLink({
  v,
  device
}: CSSValue): string {
  const bgColor = styleBgColor({
    v,
    device,
    state: "normal",
    prefix: "postButtonBg"
  });

  return bgColor === undefined ? "" : `color:${bgColor} !important;`;
}

export function cssStyleElementCommentsNameColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "nameColor" });
}

export function cssStyleElementCommentsCommentsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "commentsColor" });
}

export function cssStyleElementCommentsChildMargin({
  v,
  device,
  state = "normal"
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const size = dvv("logoSize");
  const margin = dvv("skin") === "skin3" ? 25 : 10;

  return `margin-left:${size + margin}px;`;
}

export function cssStyleElementCommentsStarsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "starsColor" });
}

export function cssStyleElementCommentsStarsBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "starsBgColor" });
}

export function cssStyleElementCommentsStarsSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeFontSize({ v, device, state, prefix: "stars" });
}
