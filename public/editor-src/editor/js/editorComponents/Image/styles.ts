import { ElementModel, ElementProps } from "visual/component/Elements/Types";
import { getTooltipStyles } from "visual/editorComponents/tools/Tooltip/styles";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { V as Value } from "./types";

interface Props extends DynamicStylesProps<ElementModel> {
  props: ElementProps;
}

const hoverTransitionCSSFn = "cssStyleHoverTransition";
const hoverTransitionCSSFns = [
  hoverTransitionCSSFn,
  "cssStylePropertyHoverTransition"
];

const hoverImagesSizesCSSStyleFns = [
  "cssStyleElementImageHoverWidthWrapper",
  "cssStyleElementImageHoverHeightWrapper",
  "cssStyleElementImageHoverMarginLeft",
  "cssStyleElementImageHoverMarginTop"
];

export function styleHover(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-hover-animation__container": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function style(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&:not(.brz-image--hovered)": {
      standart: ["cssStyleElementImageMaxWidthPreview"]
    },
    ".brz &&": {
      standart: [
        "cssStyleElementImageHeightPreview",
        "cssStyleBorderRadius|||preview",
        "cssStyleBlendMode"
      ]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBorder|||preview",
        "cssStyleMaskDropShadow"
      ]
    },
    ".brz && .brz-picture:after": {
      standart: ["cssStyleBorderRadius|||preview"]
    },
    ".brz &&:hover .brz-picture:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||preview",
        "cssStyleBgColor|||preview",
        "cssStyleBgGradient|||preview"
      ]
    },
    ".brz && .brz-picture": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz &&:hover .brz-picture": {
      standart: ["cssStyleElementImageFilter|||preview"]
    },
    ".brz &&, .brz && .brz-picture:after, .brz && .brz-picture, .brz &&.brz-image--withHover img.brz-img, .brz &&.brz-image--withHover img.dynamic-image, .brz &&.brz-image--withHover .brz-img__hover":
      {
        standart: hoverTransitionCSSFns
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleContent(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementImageMaxWidthEditor",
        "cssStyleElementImageHeightEditor",
        "cssStyleBlendMode|||editor"
      ]
    },
    ".brz &&.brz-image--withHover img.brz-img, .brz &&.brz-image--withHover img.dynamic-image, .brz &&.brz-image--withHover .brz-img__hover":
      {
        standart: [hoverTransitionCSSFn]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleWrapper(data: Props): OutputStyle {
  const { v } = data;

  const { maskShape = "none" } = v;

  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper|||editor",
        "cssStyleElementImagePosition",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat",
        ...(maskShape === "none"
          ? ["cssStyleBorderRadius|||editor", "cssStyleBlendMode|||editor"]
          : [])
      ]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageFilter|||editor",
        ...(maskShape === "none"
          ? [
              "cssStyleBorder|||editor",
              "cssStyleElementImageBoxShadow|||editor"
            ]
          : [])
      ]
    },
    ".brz &&:hover:after": {
      standart: [
        "cssStyleElementImageBoxShadow|||editor",
        "cssStyleBgColor|||editor",
        "cssStyleBgGradient|||editor"
      ]
    },
    ".brz &&, .brz &&:after": {
      standart: hoverTransitionCSSFns
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleWrapperContainer(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleBorderRadius|||editor", ...hoverTransitionCSSFns]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleBorder|||editor",
        "cssStyleElementImageBoxShadow|||editor",
        "cssStyleMaskDropShadow"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleImage(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementImageWidthWrapper",
        "cssStyleElementImageHeightWrapper",
        "cssStyleElementImageMarginLeft",
        "cssStyleElementImageMarginTop"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleHoverImage(data: Props): OutputStyle {
  const styles = {
    ".brz &&:not(.brz-img__hover-preview):not(.brz-img__hover-population), .brz &&.brz-img__hover-gif.brz-img__hover-preview":
      {
        standart: hoverImagesSizesCSSStyleFns
      }
  };

  return renderStyles({ ...data, styles });
}

export function stylePicture(data: Props): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleElementImagePictureSizePreview"]
    },
    ".brz && > .brz-img": {
      standart: [
        "cssStyleElementImagePosition",
        "cssStyleElementImageSizePreview"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleSvgHoverWrapper(data: Omit<Props, "props">): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [hoverTransitionCSSFn]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleTooltip(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = getTooltipStyles();

  return renderStyles({ ...data, styles });
}
