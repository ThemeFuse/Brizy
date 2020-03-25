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
      standart: [
        "cssStyleSectionHeightStyle",
        "cssStyleFlexVerticalAlign",
        "cssStyleDisplayFlex"
      ],
      interval: ["cssStyleVisibleMode|||editor"]
    },
    ".brz &&:hover > .brz-bg-media": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleFilter", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-shape__top": {
      standart: [
        "cssStyleShapeTopType",
        "cssStyleShapeTopHeight",
        "cssStyleShapeTopFlip",
        "cssStyleShapeTopIndex"
      ]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-shape__bottom": {
      standart: [
        "cssStyleShapeBottomType",
        "cssStyleShapeBottomHeight",
        "cssStyleShapeBottomFlip",
        "cssStyleShapeBottomIndex"
      ]
    },
    ".brz &&:hover > .brz-bg-content": {
      standart: [
        "cssStyleBoxShadowSection",
        "cssStylePaddingPreview",
        "cssStylePaddingRightLeftForEditor"
      ]
    },
    ".brz &&:hover > .brz-bg-content > .brz-ed-draggable__padding--top": {
      standart: ["cssStylePaddingTopForEditorResizer"]
    },
    ".brz &&:hover > .brz-bg-content > .brz-ed-draggable__padding--bottom": {
      standart: ["cssStylePaddingBottomForEditorResizer"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleSectionMaxWidth"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainerWrap(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSectionContainerType"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
