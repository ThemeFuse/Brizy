import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function style(v: Value, vs: Value, vd: Value): string[] {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeSize", "cssStyleSizeHeightPxOnly"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover > .brz-ed-box__resizer": {
      standart: IS_EDITOR ? ["cssStyleElementMapPropertyPositionFixed"] : []
    },
    ".brz &&:hover .brz-map-content": {
      standart: [
        "cssStyleBorderRadius",
        ...(IS_PREVIEW ? ["cssStyleElementMapPropertyPositionFixed"] : [])
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-iframe": {
      standart: [
        "cssStyleFilter",
        "cssStylePaddingBG",
        "cssStyleBgColor",
        "cssStyleBgGradient"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
