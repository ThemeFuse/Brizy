import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageMaxWidthPreview",
        "cssStyleElementImageHeightPreview",
        "cssStyleBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleElementImageBorderRadius|||preview"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageTransitionProperty"
      ]
    },
    ".brz &&:hover:after": {
      standart: ["cssStyleBoxShadow|||preview"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageTransitionProperty"
      ]
    },
    ".brz &&:hover .brz-picture": {
      standart: ["cssStyleElementImageFilter|||preview"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageTransitionProperty"
      ]
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
        "cssStyleElementImageHeightWrapper",
        "cssStyleElementImageBorderRadius|||editor",
        "cssStyleBoxShadow|||editor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageTransitionProperty"
      ]
    },
    ".brz &&:hover:after": {
      standart: ["cssStyleBoxShadow|||editor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageTransitionProperty"
      ]
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
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageTransitionProperty"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function stylePicture(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementImagePictureSize"]
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
