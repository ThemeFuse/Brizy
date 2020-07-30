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

// Style Typography Title Video

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontFamily({
  v,
  device
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2LineHeight({
  v,
  device
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2FontWeight({
  v,
  device
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "subTitle" });
}

export function cssStyleElementVideoPlaylistSubTitleVideoTypography2LetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "subTitle" });
}

export function cssStyleSizeWidthPixel({ v, device, state }) {
  const widthSidebar = styleSidebarSizeWidthPixed({ v, device, state });

  return widthSidebar === undefined ? "" : `width:${widthSidebar}px;`;
}

export function cssStyleElementVideoPlaylistImageSize({ v, device, state }) {
  const widthImage = styleElementVideoImageSize({ v, device, state });

  return widthImage === undefined
    ? ""
    : `max-width:${widthImage}px; flex: 1 1 ${widthImage}px;`;
}

export function cssStyleElementVideoPlaylistBorderItem({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "item" });
}

export function cssStyleSizeWidthVideoBlock({ v, device, state }) {
  const widthSidebar = styleSidebarSizeWidthPixed({ v, device, state });

  return widthSidebar === undefined
    ? ""
    : `width: calc(100% - ${widthSidebar}px);`;
}

export function cssStyleElementVideoPlaylistGridItemWidth({ v, device }) {
  const gridColumn = defaultValueValue({ v, key: "gridColumn", device });
  const width = gridColumn > 1 ? 100 / gridColumn : 100;

  return `max-width:${width}%; flex: 0 0 ${width}%;`;
}

export function cssStyleCoverIconColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "iconColor" });
}

export function cssStyleCoverSubTitleColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "subTitleColor" });
}

export function cssStyleBgIconCoverColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "iconBg" });
}

export function cssStyleElementVideoPlaylistItemActiveBg({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "activeBg" });
}

export function cssStyleElementVideoPlaylistBorderItemActive({
  v,
  device,
  state
}) {
  return cssStyleBorder({ v, device, state, prefix: "activeItem" });
}

export function cssStyleElementVideoPlaylistItemActiveColor({
  v,
  device,
  state
}) {
  return cssStyleColor({ v, device, state, prefix: "activeColor" });
}

export function cssStyleElementVideoPlaylistItemSubtitleActiveColor({
  v,
  device,
  state
}) {
  return cssStyleColor({ v, device, state, prefix: "activeSubTitleColor" });
}
