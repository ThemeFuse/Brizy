import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageMaxWidthPreview",
        "cssStyleElementImageHeightPreview",
        "cssStyleBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleBorderRadius|||preview"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover:after": {
      standart: [
        "cssStyleBoxShadow|||preview",
        "cssStyleBgColor|||preview",
        "cssStyleBgGradient|||preview"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture": {
      standart: ["cssStyleElementImageFilter|||preview"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleContent(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageMaxWidthEditor",
        "cssStyleElementImageHeightEditor"
      ]
    },
    ".brz &&:hover .dynamic-image": {
      standart: ["cssStyleElementImageFilter|||editor"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleWrapper(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorder|||editor",
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper|||editor",
        "cssStyleElementImagePosition",
        "cssStyleBorderRadius|||editor",
        "cssStyleBoxShadow|||editor"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover:after": {
      standart: [
        "cssStyleBoxShadow|||editor",
        "cssStyleBgColor|||editor",
        "cssStyleBgGradient|||editor"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleImage(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageFilter|||editor",
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper",
        "cssStyleElementImageMarginLeft",
        "cssStyleElementImageMarginTop"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function stylePicture(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementImagePictureSizePreview"]
    },
    ".brz &&:hover > .brz-img": {
      standart: [
        "cssStyleElementImagePosition",
        "cssStyleElementImageSizePreview"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleSvg(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementImageFilter|||editor"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}
