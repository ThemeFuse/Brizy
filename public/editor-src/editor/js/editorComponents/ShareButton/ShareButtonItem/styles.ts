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
      standart: ["cssStyleElementShareButtonBorderColor"]
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
      ]
    },
    ".brz && .brz-shareButton__item-text .brz-span": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz &&, .brz && .brz-shareButton__item-icon, .brz && .brz-shareButton__item-text":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
