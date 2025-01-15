import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { DynamicStylesProps } from "visual/types";


export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },

    ".brz &&:hover:before": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleBgColor",
        "cssStyleBgGradient"
      ],
      interval: ["cssStyleHoverTransition"]
    },

    ".brz &&:hover:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    }
  };

  return renderStyles({ ...data, styles });
}
