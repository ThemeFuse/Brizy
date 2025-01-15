import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleContent(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth", "cssStyleSizeMinHeightPx"]
    },
    ".brz &&:hover .brz-audio-progress": {
      standart: ["cssStyleBg2Color"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-soundCloud-content": {
      standart: ["cssStyleBorderRadius", "cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover iframe": {
      standart: ["cssStyleSizeHeight", "cssStylePaddingBG"]
    }
  };
  return renderStyles({ ...data, styles });
}

export function styleWrapperAudio(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleDisplayFlex",
        "cssStylePaddingBG"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-audio__cover::before": {
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
    ".brz &&:hover .brz-audio-slider:before": {
      standart: ["cssStyleBg2Color", "cssStyleBorderRadius"],
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
    ".brz &&:hover": {
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
    ".brz &&:hover": {
      standart: ["cssStyleSizeFontSizeIcon", "cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
