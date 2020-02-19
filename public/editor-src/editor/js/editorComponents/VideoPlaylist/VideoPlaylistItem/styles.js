import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderRadius", "cssStyleElementVideoBgColorRatio"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-video-content, && .brz-shortcode__placeholder": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPropertyHoverTransition"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleItem(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-video-playlist__cover": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz &&:hover .brz-video-playlist__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleElementVideoBgSize"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-video-playlist__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleBgColor",
        "cssStyleDisplayFlex"
      ]
    },
    ".brz &&:hover .brz-video-playlist__cover .brz-video-playlist__cover .brz-a": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
