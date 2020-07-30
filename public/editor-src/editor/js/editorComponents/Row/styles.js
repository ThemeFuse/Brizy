import { renderStyles } from "visual/utils/cssStyle";

export function styleRow(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: IS_EDITOR
        ? ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
        : ["cssStyleVisible"],
      standart: ["cssStyleMargin"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleBg(v, vs, vd) {
  const bgInterval = [
    "cssStyleSizeMaxWidthSize",
    "cssStyleRowMinHeight",
    "cssStyleDisplayFlex"
  ];

  if (IS_EDITOR) {
    bgInterval.push("cssStyleVisible");
  }

  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleZIndex", "cssStyleFlexVerticalAlign"],
      interval: bgInterval
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
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-map": {
      standart: ["cssStyleFilter", "cssStyleBgMap"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-video": {
      standart: ["cssStyleFilter"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg-content": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover > .brz-bg-content > .brz-row": {
      interval: ["cssStyleRowReverseColumn"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStylePaddingFourFields"]
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
