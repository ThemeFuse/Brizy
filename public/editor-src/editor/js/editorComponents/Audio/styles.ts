import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleContent(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth", "cssStyleSizeMinHeightPx"]
    },
    ".brz &&:hover .brz-audio-progress": {
      standart: ["cssStyleBg2Color"]
    },
    ".brz &&:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBoxShadow"]
    },
    ".brz && .brz-soundCloud-content": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-soundCloud-content": {
      standart: ["cssStyleBgColor"]
    },
    ".brz && iframe": {
      standart: ["cssStyleSizeHeight", "cssStylePaddingBG"]
    },
    ".brz && .brz-audio-progress, .brz &&:before, .brz && .brz-soundCloud-content":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };
  return renderStyles({ ...data, styles });
}

export function styleWrapperAudio(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleDisplayFlex",
        "cssStylePaddingBG"
      ]
    },
    ".brz &&:hover": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder", "cssStyleBgColor"]
    },
    ".brz && .brz-audio__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleElementVideoBgSize",
        "cssStyleBorderRadius"
      ]
    },
    ".brz &&:hover .brz-audio-controls > .brz-audio-current-time": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-audio-controls > .brz-audio-total-time": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-audio-slider:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-audio-slider:before": {
      standart: ["cssStyleBg2Color"]
    },
    ".brz &&, .brz && .brz-audio-controls > .brz-audio-total-time, .brz && .brz-audio-slider:before":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-audio-title": {
      standart: [
        "cssStyleElementAudioTitleTypography",
        "cssStyleElementAudioTitleTextAlign",
        "cssStyleElementAudioTitleMargin"
      ]
    },
    ".brz && .brz-audio-title:hover": {
      standart: [
        "cssStyleElementAudioTitleColor",
        "cssStyleElementAudioTitleStroke",
        "cssStyleElementAudioTitleShadow",
        "cssStyleHoverTransition"
      ]
    },
    ".brz && .brz-audio-caption": {
      standart: [
        "cssStyleElementAudioCaptionTypography",
        "cssStyleElementAudioCaptionTextAlign",
        "cssStyleElementAudioTitlePadding",
        "cssStyleElementAudioTitleBorderRadius"
      ]
    },
    ".brz && .brz-audio-caption:hover": {
      standart: [
        "cssStyleElementAudioCaptionColor",
        "cssStyleElementAudioCaptionBg",
        "cssStyleElementAudioCaptionShadow",
        "cssStyleElementAudioCaptionBorder",
        "cssStyleHoverTransition"
      ]
    }
  };
  return renderStyles({ ...data, styles });
}

export function styleControls(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleElementMediaPadding",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleIcon(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleSizeFontSizeIcon",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
