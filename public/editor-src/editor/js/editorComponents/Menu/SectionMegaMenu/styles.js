import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleSectionPropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
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
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
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

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleVisibleMode|||editor"],
      standart: [
        "cssStylePaddingFourFields",
        "cssStylePaddingRightLeftForEditor",
        "cssStyleElementMegaMenuHeight",
        "cssStyleFlexColumnVerticalAlign",
        "cssStyleBorderTransparentColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
