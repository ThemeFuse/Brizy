import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { ItemValue } from "../types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ItemValue>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleElementShareButtonBorderColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-shareButton__item-icon": {
      standart: [
        "cssStyleElementShareButtonViewIcon",
        "cssStyleElementShareButtonWidthIcon",
        "cssStyleElementShareButtonBgColorIcon",
        "cssStyleElementShareButtonBgGradientIcon",
        "cssStyleElementShareButtonCustomColorIcon"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shareButton__item-icon .brz-icon-svg": {
      standart: ["cssStyleElementShareButtonIconSize"]
    },
    ".brz &&:hover .brz-shareButton__item-text": {
      standart: [
        "cssStyleElementShareButtonViewText",
        "cssStyleElementShareButtonWidthText",
        "cssStyleElementShareButtonBgColorText",
        "cssStyleElementShareButtonBgGradientText",
        "cssStyleElementShareButtonCustomColorText"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shareButton__item-text .brz-span": {
      standart: ["getAllCssStyleTypography"]
    }
  };

  return renderStyles({ ...data, styles });
}
