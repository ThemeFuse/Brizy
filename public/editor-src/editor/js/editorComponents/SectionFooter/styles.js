import { renderStyles } from "visual/utils/cssStyle";

export function styleSection(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleVisible"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover > .brz-bg-media": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleSectionPropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleBgImagePosition"],
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
      standart: ["cssStyleBoxShadowSection"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleSectionPropertyHoverTransition"
      ]
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
      standart: ["cssStyleSectionContainerType", "cssStylePaddingSection"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
