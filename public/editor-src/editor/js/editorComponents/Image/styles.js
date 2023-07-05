import { renderStyles } from "visual/utils/cssStyle";

export function styleHover(v, vs, vd, props) {
  const styles = {
    ".brz &&.brz-hover-animation__container": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function style(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover:not(.brz-image--hovered)": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageHeightPreview",
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleBorderRadius|||preview",
        "cssStyleMaskDropShadow"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBgColor|||preview",
        "cssStyleBgGradient|||preview",
        "cssStyleBorderRadius|||preview"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .brz-picture": {
      standart: [
        "cssStyleElementImageFilter|||preview",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
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
  const { maskShape = "none" } = v;
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageFilter|||editor",
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper|||editor",
        "cssStyleElementImagePosition",
        ...(maskShape === "none"
          ? [
              "cssStyleBorder|||editor",
              "cssStyleBorderRadius|||editor",
              "cssStyleElementImageBoxShadow|||editor"
            ]
          : []),
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
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
        "cssStyleMaskDropShadow"
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
