import { isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data.contexts;

  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementImageGalleryWidth",
        "cssStyleElementImageGalleryMargin",
        "cssStyleElementImageGalleryGridItemsSpacing"
      ]
    },
    ".brz && .brz-image__gallery-item": {
      standart: [
        "cssStyleElementImageGalleryItemWidth",
        "cssStyleElementImageGalleryItemPadding"
      ]
    },
    ".brz &&.brz-image__gallery-grid .brz-image__gallery-item": {
      standart: ["cssStyleElementImageGalleryGridAspectRatio"]
    },
    ".brz &&.brz-image__gallery-with-thumb .brz-image__gallery-item .brz-image, .brz &&.brz-image__gallery-with-thumb .brz-image__gallery-item .brz-ed-image__wrapper":
      {
        standart: ["cssStyleElementImageGalleryBorderRadiusThumbnail"]
      },
    ".brz && .brz-image__gallery-item .brz-picture": {
      standart: [
        ...(isView(renderContext)
          ? [
              "cssStyleElementImageGalleryBigImageImagesMaskShape",
              "cssStyleElementImageGalleryBigImageImagesMaskSize",
              "cssStyleElementImageGalleryBigImageImagesMaskPosition",
              "cssStyleElementImageGalleryBigImageImagesMaskRepeat",
              "cssStyleElementImageGalleryBigImageImagesCustomMask"
            ]
          : [])
      ]
    },
    ".brz &&.brz-image__gallery-with-thumb .brz-image__gallery-item .brz-picture:after":
      {
        standart: ["cssStyleElementImageGalleryBorderRadiusThumbnail"]
      },
    ".brz && .brz-image__gallery-item .brz-ed-image__wrapper": {
      standart: [
        "cssStyleElementImageGalleryBigImageImagesMaskShape",
        "cssStyleElementImageGalleryBigImageImagesMaskSize",
        "cssStyleElementImageGalleryBigImageImagesMaskPosition",
        "cssStyleElementImageGalleryBigImageImagesMaskRepeat",
        "cssStyleElementImageGalleryBigImageImagesCustomMask"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleForFilter(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz && .brz-image__gallery-filter__item, .brz && .brz-image__gallery-filter__item--style-1:not(.brz-image__gallery-filter__item--active), .brz &&.brz-image__gallery-filter--style-2":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz &&": {
      standart: [
        "cssStyleElementImageGalleryFilterAfterSpacing",
        "cssStyleElementImageGalleryFilterHorizontalAlign"
      ]
    },
    ".brz && .brz-image__gallery-filter__item": {
      standart: [
        "cssStyleElementImageGalleryFilterSpacing",
        "cssStyleElementImageGallery3FontFamily",
        "cssStyleElementImageGallery3FontSize",
        "cssStyleElementImageGallery3LineHeight",
        "cssStyleElementImageGallery3FontWeight",
        "cssStyleElementImageGallery3LetterSpacing",
        "cssStyleElementImageGallery3FontVariation",
        "cssStyleElementImageGalleryFilterTextTransform"
      ]
    },
    ".brz && .brz-image__gallery-filter__item:not(.brz-image__gallery-filter__item--active):hover":
      {
        standart: ["cssStyleElementImageGalleryFilterColor"]
      },
    ".brz && .brz-image__gallery-filter__item--style-1": {
      standart: [
        "cssStyleElementAccordionFilterPaddingFourFields",
        "cssStyleElementImageGalleryBorderRadius"
      ]
    },
    ".brz && .brz-image__gallery-filter__item--style-1:not(.brz-image__gallery-filter__item--active)":
      {
        standart: ["cssStyleElementImageGalleryBorderRadius"]
      },
    ".brz && .brz-image__gallery-filter__item--style-1:not(.brz-image__gallery-filter__item--active):hover":
      {
        standart: [
          "cssStyleElementImageGalleryFilterBgColor",
          "cssStyleElementImageGalleryFilterBorder",
          "cssStyleElementImageGalleryFilterBoxShadow"
        ]
      },
    ".brz && .brz-image__gallery-filter__item--style-1.brz-image__gallery-filter__item--active":
      {
        standart: [
          "cssStyleElementImageGalleryFilterActiveColor",
          "cssStyleElementImageGalleryFilterActiveBgColor",
          "cssStyleElementImageGalleryFilterActiveBorder",
          "cssStyleElementImageGalleryFilterActiveShadow"
        ]
      },
    ".brz &&.brz-image__gallery-filter--style-2": {
      standart: [
        "cssStyleElementAccordionFilterPaddingFourFields",
        "cssStyleDisplayInlineFlex",
        "cssStyleElementImageGalleryBorderRadius"
      ]
    },
    ".brz &&.brz-image__gallery-filter--style-2:hover": {
      standart: [
        "cssStyleElementImageGalleryFilterBgColor",
        "cssStyleElementImageGalleryFilterBorder",
        "cssStyleElementImageGalleryFilterBoxShadow"
      ]
    },
    ".brz && .brz-image__gallery-filter__item--style-2.brz-image__gallery-filter__item--active":
      {
        standart: ["cssStyleElementImageGalleryFilterActiveColor"]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleBigImage(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementImageGalleryBigImageSpacing",
        "cssStyleElementImageGalleryBigImageWidth"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleWrapper(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz && .brz-image__gallery-container": {
      standart: ["cssStyleElementImageGalleryBigImageStyle"]
    }
  };

  return renderStyles({ ...data, styles });
}
