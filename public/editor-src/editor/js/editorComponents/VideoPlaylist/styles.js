import { renderStyles } from "visual/utils/cssStyle";

export function styleContents(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: IS_PREVIEW
        ? [
            "cssStyleSizeWidth",
            "cssStyleBorder",
            "cssStyleBorderRadius",
            "cssStyleBgColor",
            "cssStyleBoxShadow"
          ]
        : ["cssStyleSizeWidth"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-video-playlist__container": {
      standart: IS_EDITOR
        ? ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBgColor"]
        : ["cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-video-playlist-sidebar": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
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

    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover": {
      standart: ["cssStyleBgColor", "cssStyleElementVideoPlaylistBorderItem"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
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
    ".brz && .brz-video-playlist-video-item .brz-video-playlist-title-video span:first-child": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight"
      ]
    },
    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover .brz-video-playlist-title-video span:first-child": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
    },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:first-child": {
      standart: ["cssStyleElementVideoPlaylistItemActiveColor"]
    },
    ".brz && .brz-video-playlist-video-item .brz-video-playlist-title-video span:last-child": {
      standart: [
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontFamily",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontSize",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2LineHeight",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontWeight",
        "cssStyleElementVideoPlaylistSubTitleVideoTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover .brz-video-playlist-title-video span:last-child": {
      standart: ["cssStyleCoverSubTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
    },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:last-child": {
      standart: ["cssStyleElementVideoPlaylistItemSubtitleActiveColor"]
    },
    ".brz &&:hover .brz-video-playlist-video-elem": {
      standart: ["cssStyleElementVideoPlaylistImageSize"]
    },
    ".brz &&:hover .brz-iframe, && .brz-video-playlist__cover:before, .brz && .brz-video-playlist-video-elem": {
      standart: ["cssStyleElementVideoFilter"]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-video-playlist__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleBgIconCoverColor",
        "cssStyleDisplayFlex"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-play-button": {
      standart: ["cssStyleCoverIconColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
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
      standart: ["cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPlaylistPropertyHoverTransition"
      ]
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
