import { renderStyles } from "visual/utils/cssStyle";

export function styleContents(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: IS_PREVIEW
        ? [
            "cssStyleSizeWidthPercent",
            "cssStyleBorder",
            "cssStyleBorderRadius",
            "cssStyleBgColor",
            "cssStyleBoxShadow"
          ]
        : ["cssStyleSizeWidthPercent"]
    },
    ".brz &&:hover .brz-video-playlist__container": {
      standart: IS_EDITOR
        ? ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBgColor"]
        : ["cssStyleBgColor"]
    },
    ".brz &&:hover .brz-video-playlist-sidebar": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:before:hover": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"]
    },

    // Horizontal
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-main": {
      standart: ["cssStyleSizeWidthVideoBlock"]
    },
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-sidebar": {
      standart: ["cssStyleSizeWidthPixel"]
    },
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-video-item": {
      standart: ["cssStyleDisplayFlex"]
    },

    // Vertical
    ".brz &&.brz-video-playlist-vertical .brz-video-playlist-video-item": {
      standart: ["cssStyleElementVideoPlaylistGridItemWidth"]
    },

    ".brz && .brz-video-playlist-video-item:hover": {
      standart: ["cssStyleBgColor", "cssStyleElementVideoPlaylistBorderItem"]
    },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active": {
      standart: [
        "cssStyleElementVideoPlaylistItemActiveBg",
        "cssStyleElementVideoPlaylistBorderItemActive"
      ]
    },
    ".brz &&:hover .brz-video-playlist-video-item": {
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleMargin",
        "cssStyleFlexVerticalAlign"
      ]
    },
    ".brz &&:hover .brz-video-playlist-video-item .brz-video-playlist-title-video span:first-child": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight"
      ]
    },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:first-child": {
      standart: ["cssStyleElementVideoPlaylistItemActiveColor"]
    },
    ".brz &&:hover .brz-video-playlist-video-item .brz-video-playlist-title-video span:last-child": {
      standart: [
        "cssStyleCoverSubTitleColor",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontFamily",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontSize",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2LineHeight",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontWeight",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:last-child": {
      standart: ["cssStyleElementVideoPlaylistItemSubtitleActiveColor"]
    },
    ".brz &&:hover .brz-video-playlist-video-element": {
      standart: ["cssStyleElementVideoPlaylistImageSize"]
    },
    ".brz &&:hover .brz-iframe, && .brz-video-playlist__cover:before": {
      standart: ["cssStyleElementVideoFilter"]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-video-playlist__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleBgIconCoverColor",
        "cssStyleDisplayFlex"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-a": {
      standart: ["cssStyleCoverIconColor"]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: ["cssStyleElementVideoBgSize"]
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

export function styleCover(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-video-playlist__cover": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
