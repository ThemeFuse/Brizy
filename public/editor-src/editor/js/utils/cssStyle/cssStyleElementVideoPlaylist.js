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

  return widthImage === undefined ? "" : `width:${widthImage}px;`;
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
