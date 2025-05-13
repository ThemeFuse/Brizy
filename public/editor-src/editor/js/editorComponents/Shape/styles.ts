import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz &&:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover:before": {
      standart: [
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBgColor",
        "cssStyleBgGradient"
      ],
      interval: ["cssStyleHoverTransition"]
    },

    ".brz &&:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    }
  };

  return renderStyles({ ...data, styles });
}
