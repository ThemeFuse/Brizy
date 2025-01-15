import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./type";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
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

  return renderStyles({ ...data, styles });
}
