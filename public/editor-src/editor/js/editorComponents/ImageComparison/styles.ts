import { ElementModel, ElementProps } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

interface Props extends DynamicStylesProps<ElementModel> {
  props: ElementProps;
}

const hoverTransitionCSSFn = "cssStyleHoverTransition";
const hoverTransitionCSSFns = [
  hoverTransitionCSSFn,
  "cssStylePropertyHoverTransition"
];

const sliderCSSFNs = {
  ".brz && .brz-image-comparison__thumb": {
    standart: ["cssStyleElementImageComparisonThumbArrowBgColor"]
  },
  ".brz && .brz-image-comparison__thumb-icon": {
    standart: ["cssStyleElementImageComparisonThumbArrowColor"]
  }
};

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
        "cssStyleBoxShadow",
        "cssStyleBorder|||preview",
        "cssStyleMaskDropShadow"
      ]
    },
    ".brz && .brz-picture:after": {
      standart: ["cssStyleBorderRadius|||preview"]
    },
    ".brz &&:hover .brz-picture:after": {
      standart: [
        "cssStyleBgColor|||preview",
        "cssStyleBgGradient|||preview"
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
      },
    ...sliderCSSFNs
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

export function styleSlider(data: Props): OutputStyle {
  return renderStyles({ ...data, styles: sliderCSSFNs });
}
