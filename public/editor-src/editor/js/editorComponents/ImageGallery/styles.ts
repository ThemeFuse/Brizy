import { isView } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data;
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageGalleryWidth",
        "cssStyleElementImageGalleryMargin",
        "cssStyleElementImageGalleryGridItemsSpacing"
      ]
    },
    ".brz &&:hover .brz-image__gallery-item": {
      standart: [
        "cssStyleElementImageGalleryItemWidth",
        "cssStyleElementImageGalleryItemPadding"
      ]
    },
    ".brz &&.brz-image__gallery-grid .brz-image__gallery-item": {
      standart: ["cssStyleElementImageGalleryGridAspectRatio"]
    },
    ".brz &&.brz-image__gallery-with-thumb .brz-image__gallery-item:hover .brz-image":
      {
        standart: ["cssStyleElementImageGalleryBorderRadiusThumbnail"]
      },

    ".brz && .brz-image__gallery-item:hover .brz-picture": {
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

    ".brz &&.brz-image__gallery-with-thumb .brz-image__gallery-item:hover .brz-picture:after":
      {
        standart: ["cssStyleElementImageGalleryBorderRadiusThumbnail"]
      },

    ".brz &&.brz-image__gallery-with-thumb .brz-image__gallery-item:hover .brz-ed-image__wrapper":
      {
        standart: ["cssStyleElementImageGalleryBorderRadiusThumbnail"]
      },

    ".brz && .brz-image__gallery-item:hover .brz-ed-image__wrapper": {
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
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
    ".brz && .brz-image__gallery-filter__item--style-1:not(.brz-image__gallery-filter__item--active):hover":
      {
        standart: [
          "cssStyleElementImageGalleryFilterBgColor",
          "cssStyleElementImageGalleryFilterBorder",
          "cssStyleElementImageGalleryFilterBoxShadow",
          "cssStyleElementImageGalleryBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-image__gallery-filter__item--style-1.brz-image__gallery-filter__item--active":
      {
        standart: [
          "cssStyleElementImageGalleryFilterActiveColor",
          "cssStyleElementImageGalleryFilterActiveBgColor",
          "cssStyleElementImageGalleryFilterActiveBorder",
          "cssStyleElementImageGalleryFilterActiveShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz &&.brz-image__gallery-filter--style-2:hover": {
      standart: [
        "cssStyleElementAccordionFilterPaddingFourFields",
        "cssStyleElementImageGalleryFilterBgColor",
        "cssStyleElementImageGalleryFilterBorder",
        "cssStyleElementImageGalleryFilterBoxShadow",
        "cssStyleDisplayInlineFlex",
        "cssStyleElementImageGalleryBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-image__gallery-filter__item--style-2.brz-image__gallery-filter__item--active":
      {
        standart: ["cssStyleElementImageGalleryFilterActiveColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleBigImage(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageGalleryBigImageSpacing",
        "cssStyleElementImageGalleryBigImageWidth"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleWrapper(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz && .brz-image__gallery-container": {
      standart: ["cssStyleElementImageGalleryBigImageStyle"]
    }
  };

  return renderStyles({ ...data, styles });
}
