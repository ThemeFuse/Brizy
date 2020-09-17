import { renderStyles } from "visual/utils/cssStyle";

export function styleRow(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleRowMinHeight", "cssStyleDisplayFlex"],
      standart: [
        "cssStyleMargin",
        "cssStyleZIndex",
        "cssStyleFlexVerticalAlign"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleSizeMaxWidthSize"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition",
        "cssStyleBgMediaImage"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-map": {
      standart: ["cssStyleFilter", "cssStyleBgMediaMap"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-video": {
      standart: ["cssStyleFilter", "cssStyleBgMediaVideo"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-row": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: [
        "cssStyleRowReverseColumn",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
    }
  };

  if (IS_EDITOR) {
    styles[".brz &&:hover"].interval.push(
      "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
    );
  } else {
    styles[".brz &&:hover"].interval.push("cssStyleVisible|||preview");
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStylePaddingFourFields", "cssStyleSizeMaxWidthSize"],
      interval: IS_EDITOR ? ["cssStyleVisible|||editor"] : []
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
