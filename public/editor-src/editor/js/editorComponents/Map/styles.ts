import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function style(v: Value, vs: Value, vd: Value): string[] {
  const { hoverName = "none" } = v;
  const hoverSelector =
    hoverName === "none" ? ".brz-map_styles" : ` .brz-map-content`;
  const styles = {
    ".brz &&:hover.brz-map": {
      standart: ["cssStyleSizeSize", "cssStyleSizeHeightPxOnly"]
    },
    [`.brz &&:hover${hoverSelector}:before`]: {
      standart: ["cssStyleBorder", "cssStyleBorderRadius"],
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
        "cssStyleBoxShadow",
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
