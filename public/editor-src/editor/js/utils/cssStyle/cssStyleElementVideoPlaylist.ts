import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleColor,
  cssStylePadding,
  cssStyleSizeWidthPrefix,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight,
  cssStyleSizeFontSize
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";

// Style Typography Title Video

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "subTitle"
  });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix: "subTitle"
  });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    prefix: "subTitle"
  });
}

export function cssStyleElementVideoPlaylistControlsVideoTypography2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "controls" });
}

export function cssStyleElementVideoPlaylistControlsVideoTypography2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "controls" });
}

export function cssStyleElementVideoPlaylistControlsVideoTypography2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "controls" });
}

export function cssStyleElementVideoPlaylistControlsVideoTypography2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "controls" });
}

export function cssStyleElementVideoPlaylistControlsVideoTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "controls"
  });
}

export function cssStyleElementVideoPlaylistControlsVideoTypography2FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix: "controls"
  });
}

export function cssStyleElementVideoPlaylistControlsVideoTextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    prefix: "controls"
  });
}

export function cssStyleSizeWidthPixel({ v, device, state }: CSSValue): string {
  return cssStyleSizeWidthPrefix({ v, device, state, prefix: "widthSidebar" });
}

export function cssStyleElementVideoPlaylistImageSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const widthImage = dvv("widthImage");

  return widthImage === undefined
    ? ""
    : `max-width:${widthImage}px; flex: 1 1 ${widthImage}px;`;
}

export function cssStyleElementVideoPlaylistBorderItem({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "item" });
}

export function cssStyleSizeWidthVideoBlock({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const widthSidebar = dvv("widthSidebar");

  return widthSidebar === undefined
    ? ""
    : `width: calc(100% - ${widthSidebar}px);`;
}

export function cssStyleElementVideoPlaylistGridItemWidth({
  v,
  device
}: CSSValue): string {
  const gridColumn = defaultValueValue({ v, key: "gridColumn", device });
  const width = gridColumn > 1 ? 100 / gridColumn : 100;

  return `max-width:${width}%; flex: 0 0 ${width}%;`;
}

export function cssStyleCoverIconColor({ v, device, state }: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "iconColor" });
}

export function cssStyleCoverSubTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "subTitleColor" });
}

export function cssStyleBgIconCoverColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "iconBg" });
}

export function cssStyleElementVideoPlaylistItemActiveBg({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix: "bg" });
}

export function cssStyleElementVideoPlaylistBorderItemActive({
  v,
  device
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", prefix: "item" });
}

export function cssStyleElementVideoPlaylistItemActiveColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix: "color" });
}

export function cssStyleElementVideoPlaylistItemSubtitleActiveColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state: "active",
    prefix: "subTitleColor"
  });
}

export function cssStyleElementVideoPlaylistCoverPaddingBG({
  v,
  device,
  state
}: CSSValue): string {
  const p = cssStylePadding({ v, device, state, prefix: "bg" });

  const noEmptyGrouped =
    p.paddingTop === p.paddingRight &&
    p.paddingTop === p.paddingBottom &&
    p.paddingTop === p.paddingLeft &&
    p.paddingTop > 0;

  const empty =
    p.paddingTop === 0 &&
    p.paddingRight === 0 &&
    p.paddingBottom === 0 &&
    p.paddingLeft === 0;

  if (empty) {
    return "margin:0; padding:0!important;";
  } else if (noEmptyGrouped) {
    return `margin:${p.paddingTop}${p.paddingTopSuffix}; margin-right:0!important; padding:0!important;`;
  } else {
    return `margin:${p.paddingTop}${p.paddingTopSuffix} 0 ${p.paddingBottom}${p.paddingBottomSuffix} ${p.paddingLeft}${p.paddingLeftSuffix}; padding:0!important;`;
  }
}

export function cssStyleVideoControlsBg({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "controlsBg" });
}

export function cssStyleVideoIconControls({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "iconControlsColor" });
}

export function cssStyleVideoSlider({ v, device, state }: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "controlsSlider" });
}

export function cssStyleElementVideoControlsIconFontSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    prefix: "controlsIconCustom"
  });
}
