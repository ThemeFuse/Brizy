import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const rowContainer =
    ".brz && .brz-container__wrap > .brz-container > .brz-row__container ";
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
    ".brz &&:hover > .brz-bg-content > .brz-container__wrap": {
      standart: [
        "cssStyleContainerPopup2ContainerWidth",
        "cssStyleContainerPopup2CustomHeight"
      ]
    },
    ".brz &&:hover .brz-ed-border > .brz-row__bg > .brz-bg-content": {
      standart: IS_EDITOR ? ["cssStyleContainerPopup2CustomHeightOverflow"] : []
    },
    ".brz &&:hover .brz-row__bg > .brz-bg-content": {
      standart: IS_PREVIEW
        ? ["cssStyleContainerPopup2CustomHeightOverflow"]
        : []
    },
    ".brz &&:hover .brz-container > .brz-row__container > .brz-ed-border > .brz-bg": {
      standart: IS_EDITOR
        ? [
            "cssStyleRowMinHeight",
            "cssStyleContainerPopup2RowFlexVerticalAlign"
          ]
        : []
    },
    ".brz &&:hover .brz-container > .brz-row__container > .brz-bg": {
      standart: IS_PREVIEW
        ? [
            "cssStyleRowMinHeight",
            "cssStyleContainerPopup2RowFlexVerticalAlign"
          ]
        : []
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
        "cssStyleContainerPopup2CloseBorderRadius",
        "cssStyleBoxShadow"
      ]
    },

    [`.brz && > .brz-ed-border, ${rowContainer} > .brz-ed-border`]: {
      standart: IS_EDITOR
        ? [
            "cssStyleContainerPopup2Custom2MaxHeight100",
            "cssStyleContainerPopup2Custom2Height100"
          ]
        : []
    },
    [`${rowContainer}, ${rowContainer} > .brz-ed-border > .brz-row__bg`]: {
      standart: IS_EDITOR
        ? [
            "cssStyleContainerPopup2Custom2MaxHeight100",
            "cssStyleContainerPopup2Custom2Height100"
          ]
        : []
    },
    [`${rowContainer} , ${rowContainer} > .brz-row__bg`]: {
      standart: IS_PREVIEW
        ? [
            "cssStyleContainerPopup2Custom2MaxHeight100",
            "cssStyleContainerPopup2Custom2Height100"
          ]
        : []
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
