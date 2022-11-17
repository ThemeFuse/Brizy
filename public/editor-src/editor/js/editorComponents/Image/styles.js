import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageMaxWidthPreview",
        "cssStyleElementImageHeightPreview",
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleBorderRadius|||preview",
        "cssStyleElementImageMaskDropShadow"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBgColor|||preview",
        "cssStyleBgGradient|||preview"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture": {
      standart: [
        "cssStyleElementImageFilter|||preview",
        "cssStyleElementImageMaskShape",
        "cssStyleElementImageCustomImage",
        "cssStyleElementImageMaskSize",
        "cssStyleElementImageMaskPosition",
        "cssStyleElementImageMaskRepeat"
      ],
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
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleWrapper(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageFilter|||editor",
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper|||editor",
        "cssStyleElementImagePosition",
        ...(v.maskShape === "none"
          ? [
              "cssStyleBorder|||editor",
              "cssStyleBorderRadius|||editor",
              "cssStyleElementImageBoxShadow|||editor"
            ]
          : []),
        "cssStyleElementImageMaskShape",
        "cssStyleElementImageCustomImage",
        "cssStyleElementImageMaskSize",
        "cssStyleElementImageMaskPosition",
        "cssStyleElementImageMaskRepeat"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||editor",
        "cssStyleBgColor|||editor",
        "cssStyleBgGradient|||editor"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleWrapperContainer(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorderRadius|||editor",
        "cssStyleBorder|||editor",
        "cssStyleElementImageBoxShadow|||editor",
        "cssStyleElementImageMaskDropShadow"
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
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper",
        "cssStyleElementImageMarginLeft",
        "cssStyleElementImageMarginTop"
      ]
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
