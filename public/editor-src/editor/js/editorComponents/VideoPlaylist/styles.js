import { renderStyles } from "visual/utils/cssStyle";

export function styleContents(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthPercent"]
    },
    ".brz &&:hover .flex-grid": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleBorderRadius"
      ]
    },
    ".brz &&:hover .main": {
      standart: ["cssStyleSizeWidthVideoBlock"]
    },
    ".brz &&:hover .sidebar": {
      standart: ["cssStyleDisplayFlex", "cssStyleSizeWidthPixel"]
    },
    ".brz && .brz-video-playlist-item-container:hover": {
      standart: ["cssStyleBgColor", "cssStyleElementVideoPlaylistBorderItem"]
    },
    ".brz &&:hover .brz-video-playlist-item-container": {
      standart: [
        "cssStyleElementImageGalleryItemWidth",
        "cssStylePaddingFourFields",
        "cssStyleMargin"
      ]
    },
    ".brz &&:hover .video-item, .v-cont": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover .video-container .brz-video-content": {
      standart: ["cssStyleElementVideoPointerEvents"]
    },
    ".brz &&:hover .video-item .title-video": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .video-item .title-video span:first-child": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight"
      ]
    },
    ".brz &&:hover .video-item .title-video span:last-child": {
      standart: [
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontFamily",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontSize",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2LineHeight",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontWeight",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2LetterSpacing"
      ]
    },
    ".brz &&:hover .video-element": {
      standart: ["cssStyleElementVideoPlaylistImageSize"]
    },
    ".brz &&:hover .brz-iframe, && .brz-video-playlist__cover:before": {
      standart: ["cssStyleElementVideoFilter"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleSideBar(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBgColor"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
