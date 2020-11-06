import { renderStyles } from "visual/utils/cssStyle";

export function styleColumn(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||preview",
        "cssStyleFlexColumn",
        "cssStyleSizeMaxWidthPercent",
        "cssStyleFlexColumnVerticalAlign"
      ]
    },
    ".brz &&:hover > .brz-bg": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleMargin"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-image": {
      standart: [
        "cssStyleBgImage",
        "cssStyleFilter",
        "cssStyleBgImagePosition"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  if (IS_EDITOR) {
    styles[".brz &&:hover > *"] = {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    };
    styles[".brz &&:hover > .brz-bg"].interval.push("cssStyleVisible|||editor");
    styles[".brz &&:hover > .brz-column__items"] = {
      interval: ["cssStyleVisible|||editor"]
    };
  } else {
    styles[".brz &&:hover > *"] = {
      interval: ["cssStyleVisible|||preview"]
    };
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleItems(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleZIndex|||editor",
        "cssStyleMargin",
        "cssStyleBorderTransparentColor",
        "cssStylePaddingFourFields"
      ],
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransition"
      ]
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
