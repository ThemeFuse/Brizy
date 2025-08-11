import { WithRenderContext } from "visual/providers/RenderProvider";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleElementTitleTextShadow } from "visual/utils/cssStyle/cssStyleElementWPTitle";
import { cssStyleMargin } from "visual/utils/cssStyle/cssStyleMargin";
import { cssStylePaddingFourFields } from "visual/utils/cssStyle/cssStylePadding";
import { cssStyleStrokeText } from "visual/utils/cssStyle/cssStyleStroke";
import { getAllCssStyleTypography } from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleElementAudioTitleTypography({
  v,
  device,
  getConfig,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    getConfig,
    store,
    renderContext,
    state,
    prefix: "titleTypography"
  });
}

export function cssStyleElementAudioTitleTextAlign({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) =>
    defaultValueValue({
      v,
      key,
      device,
      state
    });

  const align = dvv("titleHorizontalAlign");

  return align ? `align-self: ${align};` : "";
}

export function cssStyleElementAudioTitleColor({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    getConfig,
    store,
    state,
    prefix: "titleColor"
  });
}

export function cssStyleElementAudioTitleStroke({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleStrokeText({
    v,
    device,
    getConfig,
    store,
    state,
    prefix: "titleStroke"
  });
}

export function cssStyleElementAudioTitleShadow({
  v,
  device,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleElementTitleTextShadow({
    v,
    device,
    getConfig,
    state,
    prefix: "title"
  });
}

export function cssStyleElementAudioTitleMargin({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMargin({
    v,
    device,
    state,
    prefix: "title"
  });
}

export function cssStyleElementAudioCaptionTypography({
  v,
  device,
  getConfig,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    getConfig,
    store,
    renderContext,
    state,
    prefix: "captionTypography"
  });
}

export function cssStyleElementAudioCaptionTextAlign({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) =>
    defaultValueValue({
      v,
      key,
      device,
      state
    });

  const align = dvv("captionHorizontalAlign");

  switch (align) {
    case "left":
      return "left: 0;";
    case "right":
      return "right: 0;";
    default:
      return "";
  }
}

export function cssStyleElementAudioCaptionColor({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    getConfig,
    store,
    state,
    prefix: "captionColor"
  });
}

export function cssStyleElementAudioCaptionBg({
  v,
  device,
  getConfig,
  state
}: CSSValue): string {
  const bg = styleColor({
    v,
    device,
    getConfig,
    state,
    prefix: "captionBgColor"
  });

  return bg ? `background-color: ${bg};` : "";
}

export function cssStyleElementAudioCaptionShadow({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    getConfig,
    state,
    store,
    prefix: "caption"
  });
}

export function cssStyleElementAudioCaptionBorder({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    getConfig,
    state,
    store,
    prefix: "caption"
  });
}

export function cssStyleElementAudioTitlePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "caption"
  });
}

export function cssStyleElementAudioTitleBorderRadius({
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
    prefix: "captionCorner"
  });
}
