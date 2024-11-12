import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./type";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover.brz-lottie": {
      standart: [
        "cssStyleSizeWidth",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ]
    },
    ".brz &&:hover.brz-lottie .brz-ed-box__resizer div svg, .brz-lottie .brz-ed-box__resizer div canvas, &&.brz-lottie .brz-lottie-anim svg, &&.brz-lottie canvas":
      { standart: ["cssStylePaddingBG"] }
  };

  return renderStyles({ v, vs, vd, styles });
}
