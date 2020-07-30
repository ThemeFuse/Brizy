import { renderStyles } from "visual/utils/cssStyle";

export function styleColumn(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||preview",
        "cssStyleFlexColumn",
        "cssStyleSizeMaxWidthPercent"
      ]
    },
    ".brz &&:hover > .brz-ed-border": {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||editor",
        "cssStyleFlexVerticalAlign",
        "cssStylePaddingFourFields",
        "cssStyleMargin"
      ],
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleVisible",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
      ]
    },
    ".brz &&:hover > .brz-bg-content": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg-media": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius", "cssStyleBoxShadow"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
