import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import {
  styleSidebarSizeWidthPixed,
  styleElementVideoImageSize
} from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
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

export function cssStyleSizeWidthPixel({ v, device, state }: CSSValue): string {
  const widthSidebar = styleSidebarSizeWidthPixed({ v, device, state });

  return widthSidebar === undefined ? "" : `width:${widthSidebar}px;`;
}

export function cssStyleElementVideoPlaylistImageSize({
  v,
  device,
  state
}: CSSValue): string {
  const widthImage = styleElementVideoImageSize({ v, device, state });

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

export function cssStyleSizeWidthVideoBlock({
  v,
  device,
  state
}: CSSValue): string {
  const widthSidebar = styleSidebarSizeWidthPixed({ v, device, state });

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

export function cssStyleElementVideoPlaylistPropertyHoverTransition(): string {
  return "transition-property: color,  background-color, border-color, box-shadow, transform;";
}
