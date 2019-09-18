import { renderStyles } from "visual/utils/cssStyle";

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||editor",
        "cssStyleFlexVerticalAlign",
        "cssStylePadding",
        "cssStyleMargin"
      ],
      interval: ["cssStyleVisible"]
    },
    ".brz &&:hover > .brz-bg-content": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-media": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleBgImagePosition"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleColumn(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||preview",
        "cssStyleFlexColumn",
        "cssStyleSizeMaxWidthPercent"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
