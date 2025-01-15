import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  cssStyleColor,
  cssStyleSizeFontSize,
  cssStyleTextTransforms,
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
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "name",
    renderContext
  });
}

export function cssStyleElementCommentsNameFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "name" });
}

export function cssStyleElementCommentsNameLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "name" });
}

export function cssStyleElementCommentsNameFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "name" });
}

export function cssStyleElementCommentsNameLetterSpacing({
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
    prefix: "name"
  });
}

export function cssStyleElementCommentsNameFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "name" });
}

export function cssStyleElementCommentsNameTextTransform({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, store, state, prefix: "name" });
}

export function cssStyleElementCommentsCommentFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "comment",
    renderContext
  });
}

export function cssStyleElementCommentsCommentFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "comment" });
}

export function cssStyleElementCommentsCommentLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "comment" });
}

export function cssStyleElementCommentsCommentFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "comment" });
}

export function cssStyleElementCommentsCommentLetterSpacing({
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
    prefix: "comment"
  });
}

export function cssStyleElementCommentsCommentFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "comment"
  });
}

export function cssStyleElementCommentsCommentTextTransform({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, store, state, prefix: "comment" });
}

export function cssStyleElementCommentsDateFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "date",
    renderContext
  });
}

export function cssStyleElementCommentsDateFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "date" });
}

export function cssStyleElementCommentsDateLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "date" });
}

export function cssStyleElementCommentsDateFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "date" });
}

export function cssStyleElementCommentsDateLetterSpacing({
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
    prefix: "date"
  });
}

export function cssStyleElementCommentsDateFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "date" });
}

export function cssStyleElementCommentsDateTextTransform({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, store, state, prefix: "date" });
}

export function cssStyleElementCommentsReplyFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "reply",
    renderContext
  });
}

export function cssStyleElementCommentsReplyFontSize({
  v,
  device,
  store,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsReplyLineHeight({
  v,
  device,
  store,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsReplyFontWeight({
  v,
  device,
  store,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsReplyLetterSpacing({
  v,
  device,
  store,
  state,
  prefix = "reply"
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsReplyFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "reply"
  });
}

export function cssStyleElementCommentsReplyTextTransform({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, store, state, prefix: "reply" });
}

export function cssStyleElementCommentsPostButtonFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "postButton",
    renderContext
  });
}

export function cssStyleElementCommentsPostButtonFontSize({
  v,
  device,
  store,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    store,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsPostButtonLineHeight({
  v,
  device,
  store,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsPostButtonFontWeight({
  v,
  device,
  store,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    state,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsPostButtonLetterSpacing({
  v,
  device,
  store,
  state,
  prefix = "postButton"
}: CSSValue): string {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    state,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsPostButtonFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "postButton"
  });
}

export function cssStyleElementCommentsPostButtonTextTransform({
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
    prefix: "postButton"
  });
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
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "nameColor" });
}

export function cssStyleElementCommentsCommentsColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "commentsColor" });
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
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "starsColor" });
}

export function cssStyleElementCommentsStarsBgColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "starsBgColor" });
}

export function cssStyleElementCommentsStarsSize({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeFontSize({ v, device, store, state, prefix: "stars" });
}
