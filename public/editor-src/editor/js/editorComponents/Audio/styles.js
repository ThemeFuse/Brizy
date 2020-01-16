import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthPercent", "cssStyleSizeHeightPx"]
    }
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
        "cssStyleBgColor"
      ]
    },
    ".brz &&:hover .brz-audio__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
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

export function styleSliderProgress(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBg2Color"]
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
