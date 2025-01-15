import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbarClose";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { maskShape = "none" } = data.v;

  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover > .brz-bg": {
      standart: [...(maskShape === "none" ? [] : ["cssStyleMaskDropShadow"])]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color, .brz&&:hover > .brz-bg > .brz-bg-color":
      {
        standart: [
          "cssStyleBgColor",
          "cssStyleBgGradient",
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskSize",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ]
      }
  };
  return renderStyles({ ...data, styles });
}

export function styleInner(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: ["cssStyleFlexHorizontalAlign", "cssStyleFlexVerticalAlign"]
    },
    ".brz &&:hover > .brz-container__wrap": {
      standart: ["cssStyleSizeWidth", "cssStyleContainerPopup2CustomHeight"]
    },
    ".brz && > .brz-container__wrap .brz-popup2__close:hover": {
      standart: [
        "cssStyleContainerPopup2CloseState",
        "cssStyleContainerPopup2ClosePosition",
        "cssStyleContainerPopup2CloseColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && > .brz-container__wrap .brz-popup2__close:hover .brz-icon-svg, .brz&& > .brz-container__wrap .brz-popup2__close:hover .brz-icon-svg":
      {
        standart: [
          "cssStyleContainerPopup2CloseFontSize",
          "cssStyleContainerPopup2CloseBgSize",
          "cssStyleContainerPopup2CloseBgColor",
          "cssStyleContainerPopup2CloseBorderRadius",
          "cssStyleBoxShadow"
        ]
      },
    ".brz &&:hover .brz-container > .brz-row__container": {
      standart: [
        "cssStyleRowMinHeight",
        "cssStyleContainerPopup2RowFlexVerticalAlign"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
