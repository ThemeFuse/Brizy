import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementVideoBgColorRatio",
        "cssStyleSizeMaxWidthSize",
        "cssStyleBorderRadius"
      ]
    },
    ".brz &&:hover .brz-video-content": {
      standart: ["cssStyleBorderRadius", "cssStyleBoxShadow", "cssStyleBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-video-content, && .brz-shortcode__placeholder": {
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-iframe, && .brz-video__cover:before": {
      standart: ["cssStyleElementVideoFilter"]
    },
    ".brz &&:hover.brz-custom-video video": {
      standart: ["cssStyleElementVideoFilter"]
    },
    ".brz &&:hover .brz-video-custom-progress": {
      standart: ["cssStyleBg2Color"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleWrapper(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementVideoPaddingRatio",
        "cssStyleElementVideoPointerEvents"
      ]
    },
    ".brz &&:hover .brz-video__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleElementVideoBgSize"
      ]
    },
    ".brz &&:hover .brz-video__cover .brz-video__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleBgColor"
      ]
    },
    ".brz &&:hover .brz-video__cover .brz-video__cover-icon .brz-a": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleCustomVideo(v, vs, vd) {
  const styles = {
    ".brz &&:hover > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time": {
      standart: ["cssStyleVideoIconControls"]
    },
    ".brz &&:hover > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time": {
      standart: ["cssStyleVideoIconControls"]
    },
    ".brz &&:hover .brz-video-custom-slider:before": {
      standart: ["cssStyleBg2Color", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-video-custom-video-controls": {
      standart: ["cssStyleVideoControlsBgColor"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleControls(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementMediaPadding",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleIcon(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementVideoControlsIconFontSize",
        "cssStyleVideoIconControls"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
