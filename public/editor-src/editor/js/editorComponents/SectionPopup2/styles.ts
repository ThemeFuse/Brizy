import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./toolbarClose";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { maskShape = "none" } = data.v;

  const styles: Styles = {
    ".brz &&:hover > .brz-bg": {
      standart: [...(maskShape === "none" ? [] : ["cssStyleMaskDropShadow"])]
    },
    ".brz && > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz && > .brz-bg > .brz-bg-color, .brz&&:hover > .brz-bg > .brz-bg-color":
      {
        standart: [
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskSize",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ]
      },
    ".brz &&:hover > .brz-bg > .brz-bg-color, .brz&&:hover > .brz-bg > .brz-bg-color":
      {
        standart: ["cssStyleBgColor", "cssStyleBgGradient"]
      }
  };
  return renderStyles({ ...data, styles });
}

export function styleInner(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleFlexHorizontalAlign", "cssStyleFlexVerticalAlign"]
    },
    ".brz && > .brz-container__wrap": {
      standart: ["cssStyleSizeWidth", "cssStyleContainerPopup2CustomHeight"]
    },
    ".brz && > .brz-container__wrap .brz-popup2__close": {
      standart: [
        "cssStyleContainerPopup2CloseState",
        "cssStyleContainerPopup2ClosePosition"
      ]
    },
    ".brz && > .brz-container__wrap .brz-popup2__close:hover": {
      standart: ["cssStyleContainerPopup2CloseColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && > .brz-container__wrap .brz-popup2__close .brz-icon-svg, .brz&& > .brz-container__wrap .brz-popup2__close .brz-icon-svg":
      {
        standart: [
          "cssStyleContainerPopup2CloseFontSize",
          "cssStyleContainerPopup2CloseBgSize",
          "cssStyleContainerPopup2CloseBorderRadius"
        ]
      },
    ".brz && > .brz-container__wrap .brz-popup2__close:hover .brz-icon-svg, .brz&& > .brz-container__wrap .brz-popup2__close:hover .brz-icon-svg":
      {
        standart: ["cssStyleContainerPopup2CloseBgColor", "cssStyleBoxShadow"]
      },
    ".brz && .brz-container > .brz-row__container": {
      standart: [
        "cssStyleRowMinHeight",
        "cssStyleContainerPopup2RowFlexVerticalAlign"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
