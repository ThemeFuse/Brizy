import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeSize", "cssStyleSizeHeightPxOnly"]
    },

    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementMapPropertyHoverTransition"
      ]
    },

    ".brz &&:hover:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },

    ".brz &&:hover .brz-map-content": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementMapPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-iframe": {
      standart: ["cssStyleFilter"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementMapPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
