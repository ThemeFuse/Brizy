import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleContents(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): OutputStyle {
  const styles: Styles = {
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
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video-playlist__container": {
      standart: IS_EDITOR
        ? ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBgColor"]
        : ["cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video-playlist-sidebar": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },

    // Horizontal
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-main": {
      standart: ["cssStyleSizeWidthVideoBlock", "cssStylePaddingBG"]
    },
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-col.brz-video-playlist-main.brz-video-playlist-main__cover":
      { standart: ["cssStyleElementVideoPlaylistCoverPaddingBG"] },
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-sidebar": {
      standart: ["cssStyleSizeWidthPixel", "cssStylePaddingBG"]
    },
    ".brz &&.brz-video-playlist-horizontal .brz-video-playlist-video-item": {
      standart: ["cssStyleDisplayFlex"]
    },

    // Vertical
    ".brz &&.brz-video-playlist-vertical": {
      standart: IS_PREVIEW ? ["cssStylePaddingBG"] : []
    },
    ".brz &&.brz-video-playlist-vertical .brz-video-playlist__container": {
      standart: IS_EDITOR ? ["cssStylePaddingBG"] : []
    },
    ".brz &&.brz-video-playlist-vertical .brz-video-playlist-video-item": {
      standart: ["cssStyleElementVideoPlaylistGridItemWidth"]
    },
    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover":
      {
        standart: ["cssStyleBgColor", "cssStyleElementVideoPlaylistBorderItem"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active":
      {
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
    ".brz && .brz-video-playlist-video-item .brz-video-playlist-title-video span:first-child":
      {
        standart: [
          "cssStyleTypography2FontFamily",
          "cssStyleTypography2FontSize",
          "cssStyleTypography2LetterSpacing",
          "cssStyleTypography2FontWeight",
          "cssStyleTypography2LineHeight",
          "cssStyleTypography2FontVariation",
          "cssStyleTextTransforms"
        ]
      },
    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover .brz-video-playlist-title-video span:first-child":
      {
        standart: ["cssStyleColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:first-child":
      {
        standart: ["cssStyleElementVideoPlaylistItemActiveColor"]
      },
    ".brz && .brz-video-playlist-video-item .brz-video-playlist-title-video span:last-child":
      {
        standart: [
          "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontFamily",
          "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontSize",
          "cssStyleElementVideoPlaylistSubTitleVideoTypography2LineHeight",
          "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontWeight",
          "cssStyleElementVideoPlaylistSubTitleVideoTypography2LetterSpacing",
          "cssStyleElementVideoPlaylistSubTitleVideoTypography2FontVariation",
          "cssStyleElementVideoPlaylistSubTitleVideoTextTransform"
        ]
      },
    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover .brz-video-playlist-title-video span:last-child":
      {
        standart: ["cssStyleCoverSubTitleColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:last-child":
      {
        standart: ["cssStyleElementVideoPlaylistItemSubtitleActiveColor"]
      },
    ".brz &&:hover .brz-video-playlist-video-elem": {
      standart: ["cssStyleElementVideoPlaylistImageSize"]
    },
    ".brz &&:hover .brz-iframe, && .brz-video-playlist__cover:before, .brz && .brz-video-playlist-video-elem":
      { standart: ["cssStyleFilter"] },
    ".brz &&:hover .brz-video-playlist__cover .brz-video-playlist__cover-icon":
      {
        standart: [
          "cssStyleElementVideoIconFontSize",
          "cssStyleElementVideoIconWidth",
          "cssStyleElementVideoIconHeight",
          "cssStyleBgIconCoverColor",
          "cssStyleDisplayFlex"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz &&:hover .brz-video-playlist__cover .brz-play-button": {
      standart: ["cssStyleCoverIconColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: ["cssStyleElementVideoBgSize", "cssStyleFilter"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time:hover":
      {
        standart: ["cssStyleVideoIconControls"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time:hover":
      {
        standart: ["cssStyleVideoIconControls"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-play-pause-btn > .brz-video-custom-play:hover":
      {
        standart: [
          "cssStyleVideoIconControls",
          "cssStyleElementVideoControlsIconFontSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-play-pause-btn > .brz-video-custom-pause:hover":
      {
        standart: [
          "cssStyleVideoIconControls",
          "cssStyleElementVideoControlsIconFontSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-mute:hover":
      {
        standart: [
          "cssStyleVideoIconControls",
          "cssStyleElementVideoControlsIconFontSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-fullscreen-icon:hover":
      {
        standart: [
          "cssStyleVideoIconControls",
          "cssStyleElementVideoControlsIconFontSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-unmute:hover":
      {
        standart: [
          "cssStyleVideoIconControls",
          "cssStyleElementVideoControlsIconFontSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      },
    ".brz && .brz-video-custom-slider:hover:before": {
      standart: ["cssStyleVideoSlider", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz && .brz-video-custom-slider:hover .brz-video-custom-progress": {
      standart: ["cssStyleVideoSlider"],
      interval: [
        "cssStyleVideoSlider",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz && .brz-video-custom-video-controls:hover": {
      standart: [
        "cssStyleVideoControlsBg",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontFamily",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontSize",
        "cssStyleElementVideoPlaylistControlsVideoTypography2LineHeight",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontWeight",
        "cssStyleElementVideoPlaylistControlsVideoTypography2LetterSpacing",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontVariation",
        "cssStyleElementVideoPlaylistControlsVideoTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
export function styleCover(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover .brz-video-playlist__cover": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleFilter"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleSidebar(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
