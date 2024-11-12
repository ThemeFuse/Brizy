import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel, ElementProps } from "visual/component/Elements/Types";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleHover(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: ElementProps
): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-hover-animation__container": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: ElementProps
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover:not(.brz-image--hovered)": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageHeightPreview",
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleBorderRadius|||preview",
        "cssStyleMaskDropShadow",
        "cssStyleBlendMode"
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

export function styleContent(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: ElementProps
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageMaxWidthEditor",
        "cssStyleElementImageHeightEditor",
        "cssStyleBlendMode|||editor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles, props });
}

export function styleWrapper(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: ElementProps
): OutputStyle {
  const { maskShape = "none" } = v;
  const styles: Styles = {
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
              "cssStyleElementImageBoxShadow|||editor",
              "cssStyleBlendMode|||editor"
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

export function styleWrapperContainer(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): OutputStyle {
  const styles: Styles = {
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

  return renderStyles({ v, vs, vd, styles });
}

export function styleImage(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: ElementProps
): OutputStyle {
  const styles: Styles = {
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

export function stylePicture(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: ElementProps
): OutputStyle {
  const styles: Styles = {
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
