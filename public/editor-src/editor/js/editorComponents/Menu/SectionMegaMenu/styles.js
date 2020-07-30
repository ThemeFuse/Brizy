import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleVisibleMode|||editor",
        "cssStyleSizeMaxWidthContainer"
      ]
    },
    ".brz &&:hover > .brz-bg-media": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleSectionPropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleSectionPropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleSectionPropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-content": {
      standart: [
        "cssStylePaddingFourFields",
        "cssStylePaddingRightLeftForEditor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainerWrap(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementMegaMenuHeight",
        "cssStyleFlexVerticalAlign",
        "cssStyleDisplayFlex"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
