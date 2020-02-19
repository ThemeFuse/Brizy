import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthPercent", "cssStyleSizeMinHeightPx"]
    },
    ".brz &&:hover .progress": {
      standart: ["cssStyleBg2Color"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementSoundCloudPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .play-pause-btn, .volume, .volume-btn, .volume-controls, .brz-audio-cover, .brz-audio__cover-icon": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover .brz-soundCloud-content": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementSoundCloudPropertyHoverTransition"
      ]
    },
    ".brz &&:hover iframe": { standart: ["cssStyleSizeHeightPx"] }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleWrapperAudio(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleDisplayFlex"
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
    ".brz &&:hover > .controls > .current-time": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover > .controls > .total-time": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .slider:before": {
      standart: ["cssStyleBg2Color", "cssStyleBorderRadius"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleControls(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleElementMediaPadding",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleIcon(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementMediaIconFontSize", "cssStyleColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
