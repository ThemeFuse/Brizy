import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image:after": {
      standart: ["cssStyleBgImageHover"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleInner(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
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
      ]
    },
    ".brz && > .brz-container__wrap .brz-popup2__close:hover .brz-icon-svg": {
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

  return renderStyles({ v, vs, vd, styles });
}
