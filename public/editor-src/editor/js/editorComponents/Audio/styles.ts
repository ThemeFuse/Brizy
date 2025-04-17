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
      standart: ["cssStyleBg2Color"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-soundCloud-content": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-soundCloud-content": {
      standart: ["cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && iframe": {
      standart: ["cssStyleSizeHeight", "cssStylePaddingBG"]
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
      standart: ["cssStyleBoxShadow", "cssStyleBorder", "cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-audio__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleElementVideoBgSize",
        "cssStyleBorderRadius"
      ]
    },
    ".brz &&:hover > .brz-audio-controls > .brz-audio-current-time": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover > .brz-audio-controls > .brz-audio-total-time": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-audio-slider:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-audio-slider:before": {
      standart: ["cssStyleBg2Color"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
      standart: ["cssStyleSizeFontSizeIcon"]
    },
    ".brz &&:hover": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
