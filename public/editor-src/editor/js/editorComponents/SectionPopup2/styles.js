import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    },
    ".brz &&:hover > .brz-bg-content": {
      standart: ["cssStyleFlexHorizontalAlign", "cssStyleFlexVerticalAlign"]
    },
    ".brz &&:hover > .brz-bg-content .brz-container__wrap": {
      standart: ["cssStyleContainerPopup2ContainerWidth"]
    },
    ".brz &&:hover .brz-row__container > .brz-ed-border > .brz-bg ": {
      standart: [
        "cssStyleRowMinHeight|||editor",
        "cssStyleContainerPopup2RowFlexVerticalAlign|||editor"
      ]
    },
    ".brz &&:hover .brz-row__container > .brz-bg ": {
      standart: [
        "cssStyleRowMinHeight|||preview",
        "cssStyleContainerPopup2RowFlexVerticalAlign|||preview"
      ]
    },
    ".brz && > .brz-bg-content .brz-container__wrap .brz-popup2__close:hover": {
      standart: [
        "cssStyleContainerPopup2CloseState",
        "cssStyleContainerPopup2ClosePosition",
        "cssStyleContainerPopup2CloseColor"
      ]
    },
    ".brz && > .brz-bg-content .brz-container__wrap .brz-popup2__close:hover .brz-icon-svg": {
      standart: [
        "cssStyleContainerPopup2CloseFontSize",
        "cssStyleContainerPopup2CloseBgSize",
        "cssStyleContainerPopup2CloseBgColor",
        "cssStyleContainerPopup2CloseBorderRadius"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
