import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data;
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleColumnHeight"]
    },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item > .brz-bg": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && > .brz-flipbox-content, .brz && > .brz-flipbox-content > .brz-flipbox-item ":
      {
        interval: ["cssStyleElementFlipboxTransitionSpeed"]
      },

    //#region Front side styles
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-front": {
      standart: [
        "cssStyleElementFlipboxFrontPadding",
        "cssStyleFlexColumnVerticalAlign"
      ]
    },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-front > .brz-bg": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"]
    },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-front > .brz-bg > .brz-bg-image":
      {
        standart: [
          "cssStyleBgImage",
          "cssStyleBgImagePosition",
          "cssStyleFilter"
        ]
      },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-front > .brz-bg > .brz-bg-color":
      {
        standart: ["cssStyleBgColor", "cssStyleBgGradient"]
      },
    // content align in EDITOR mode
    // condition appears because we don't render  in preview .brz-flipbox-sortable-wrapper
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-front > .brz-flipbox-sortable-wrapper":
      {
        standart: [
          ...(isEditor(renderContext)
            ? ["cssStyleFlexColumnVerticalAlign"]
            : [])
        ]
      },
    //#endregion

    //#region Back side styles
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-back": {
      standart: [
        "cssStyleElementFlipboxBackPadding",
        "cssStyleElementFlipboxBackVerticalAlign"
      ]
    },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-back > .brz-bg": {
      standart: [
        "cssStyleElementFlipboxBackBgBorder",
        "cssStyleElementFlipboxBackBgBorderRadius",
        "cssStyleElementFlipboxBackBgBoxShadow"
      ]
    },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-back > .brz-bg > .brz-bg-image":
      {
        standart: [
          "cssStyleElementFlipboxBackBgImage",
          "cssStyleElementFlipboxBackBgImagePosition",
          "cssStyleElementFlipboxBackBgFilter"
        ]
      },
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-back > .brz-bg > .brz-bg-color":
      {
        standart: [
          "cssStyleElementFlipboxBackBgColor",
          "cssStyleElementFlipboxBackBgGradient"
        ]
      },
    // content align in EDITOR mode
    // condition appears because we don't render  in preview .brz-flipbox-sortable-wrapper
    ".brz && > .brz-flipbox-content > .brz-flipbox-item-back > .brz-flipbox-sortable-wrapper":
      {
        standart: [
          ...(isEditor(renderContext)
            ? ["cssStyleElementFlipboxBackVerticalAlign"]
            : [])
        ]
      }
    //#endregion
  };

  return renderStyles({ ...data, styles });
}
