import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { ItemValue } from "../types";

export function style(data: DynamicStylesProps<ItemValue>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover": {
      standart: ["cssStyleElementShareButtonBorderColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shareButton__item-icon": {
      standart: [
        "cssStyleElementShareButtonViewIcon",
        "cssStyleElementShareButtonWidthIcon"
      ]
    },
    ".brz &&:hover .brz-shareButton__item-icon": {
      standart: [
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
    ".brz && .brz-shareButton__item-text": {
      standart: [
        "cssStyleElementShareButtonViewText",
        "cssStyleElementShareButtonWidthText"
      ]
    },
    ".brz &&:hover .brz-shareButton__item-text": {
      standart: [
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
