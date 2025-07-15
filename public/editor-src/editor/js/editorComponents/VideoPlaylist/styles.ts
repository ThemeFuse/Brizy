import { ElementModel } from "visual/component/Elements/Types";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleContents(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext } = data.contexts;

  const _isView = isView(renderContext);
  const _isEditor = isEditor(renderContext);

  const styles: Styles = {
    ".brz &&": {
      standart: _isView
        ? ["cssStyleSizeWidth", "cssStyleBorderRadius"]
        : ["cssStyleSizeWidth"]
    },
    ".brz &&:hover": {
      standart: _isView
        ? ["cssStyleBorder", "cssStyleBgColor", "cssStyleBoxShadow"]
        : []
    },
    ".brz && .brz-video-playlist__container": {
      standart: _isEditor ? ["cssStyleBorderRadius"] : []
    },
    ".brz &&:hover .brz-video-playlist__container": {
      standart: _isEditor
        ? ["cssStyleBorder", "cssStyleBgColor"]
        : ["cssStyleBgColor"]
    },
    ".brz && .brz-video-playlist-sidebar": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow"]
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
      standart: _isView ? ["cssStylePaddingBG"] : []
    },
    ".brz &&.brz-video-playlist-vertical .brz-video-playlist__container": {
      standart: _isEditor ? ["cssStylePaddingBG"] : []
    },
    ".brz &&.brz-video-playlist-vertical .brz-video-playlist-video-item": {
      standart: ["cssStyleElementVideoPlaylistGridItemWidth"]
    },
    ".brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active):hover":
      {
        standart: ["cssStyleBgColor", "cssStyleElementVideoPlaylistBorderItem"]
      },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active":
      {
        standart: [
          "cssStyleElementVideoPlaylistItemActiveBg",
          "cssStyleElementVideoPlaylistBorderItemActive"
        ]
      },
    ".brz && .brz-video-playlist-video-item": {
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
        standart: ["cssStyleColor"]
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
        standart: ["cssStyleCoverSubTitleColor"]
      },
    ".brz && .brz-video-playlist-video-item.brz-video-playlist-video-item--active .brz-video-playlist-title-video span:last-child":
      {
        standart: ["cssStyleElementVideoPlaylistItemSubtitleActiveColor"]
      },
    ".brz && .brz-video-playlist-video-elem": {
      standart: ["cssStyleElementVideoPlaylistImageSize"]
    },
    ".brz &&:hover .brz-iframe, && .brz-video-playlist__cover:before, .brz && .brz-video-playlist-video-elem":
      { standart: ["cssStyleFilter"] },
    ".brz && .brz-video-playlist__cover .brz-video-playlist__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleDisplayFlex"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-video-playlist__cover-icon":
      {
        standart: ["cssStyleBgIconCoverColor"]
      },
    ".brz &&:hover .brz-video-playlist__cover .brz-play-button": {
      standart: ["cssStyleCoverIconColor"]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: ["cssStyleElementVideoBgSize", "cssStyleFilter"]
    },
    ".brz && .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time:hover, .brz && .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time:hover, .brz && .brz-video-custom-video-controls > .brz-video-custom-play-pause-btn > .brz-video-custom-play:hover, .brz && .brz-video-custom-video-controls > .brz-video-custom-play-pause-btn > .brz-video-custom-pause:hover, .brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-mute:hover, .brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-fullscreen-icon:hover, .brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-unmute:hover":
      {
        standart: ["cssStyleVideoIconControls"]
      },
    ".brz && .brz-video-custom-slider:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && .brz-video-custom-slider:hover:before": {
      standart: ["cssStyleVideoSlider"]
    },
    ".brz && .brz-video-custom-slider:hover .brz-video-custom-progress": {
      standart: ["cssStyleVideoSlider"]
    },
    ".brz && .brz-video-custom-video-controls": {
      standart: [
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontFamily",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontSize",
        "cssStyleElementVideoPlaylistControlsVideoTypography2LineHeight",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontWeight",
        "cssStyleElementVideoPlaylistControlsVideoTypography2LetterSpacing",
        "cssStyleElementVideoPlaylistControlsVideoTypography2FontVariation",
        "cssStyleElementVideoPlaylistControlsVideoTextTransform"
      ]
    },
    ".brz && .brz-video-custom-video-controls:hover": {
      standart: ["cssStyleVideoControlsBg"]
    },
    ".brz && .brz-video-custom-video-controls, .brz && .brz-video-custom-slider .brz-video-custom-progress, .brz && .brz-video-custom-slider:before, .brz && .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time, .brz && .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time, .brz && .brz-video-custom-video-controls > .brz-video-custom-play-pause-btn > .brz-video-custom-play, .brz && .brz-video-custom-video-controls > .brz-video-custom-play-pause-btn > .brz-video-custom-pause, .brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-mute, .brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-fullscreen-icon, .brz && .brz-video-custom-video-controls > .brz-video-custom-volume .brz-video-custom-unmute, .brz && .brz-video-playlist__cover::before, .brz && .brz-video-playlist__cover .brz-play-button, .brz && .brz-video-playlist__cover .brz-video-playlist__cover-icon, .brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active) .brz-video-playlist-title-video span:last-child, .brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active) .brz-video-playlist-title-video span:first-child, .brz &&, .brz && .brz-video-playlist__container, .brz &&:before, .brz && .brz-video-playlist-video-item:not(.brz-video-playlist-video-item--active)":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionTransform"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleCover(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles: Styles = {
    ".brz && .brz-video-playlist__cover": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz && .brz-video-playlist__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: ["cssStyleFilter"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleSidebar(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    }
  };
  return renderStyles({ ...data, styles });
}
