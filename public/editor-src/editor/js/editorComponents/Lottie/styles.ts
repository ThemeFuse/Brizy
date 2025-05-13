import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./type";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-lottie": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz &&:hover.brz-lottie": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ]
    },
    ".brz &&.brz-lottie .brz-ed-box__resizer div svg, .brz-lottie .brz-ed-box__resizer div canvas, &&.brz-lottie .brz-lottie-anim svg, &&.brz-lottie canvas":
      { standart: ["cssStylePaddingBG"] }
  };

  return renderStyles({ ...data, styles });
}
