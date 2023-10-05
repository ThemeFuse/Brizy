import { renderStyles } from "visual/utils/cssStyle";
import type { Value } from "./index";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
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
        standart: [
          "cssStyleElementImageGalleryBorderRadiusThumbnail",
          ...(IS_PREVIEW ? ["cssStyleElementImageGalleryImagesBorder"] : [])
        ]
      },

    ".brz && .brz-image__gallery-item:hover .brz-image": {
      standart: [
        "cssStyleElementImageGalleryImagesBoxShadow",
        ...(IS_PREVIEW ? ["cssStyleElementImageGalleryImagesBorder"] : []),
        ...(v.imagesMaskShape !== "none"
          ? ["cssStyleElementImageGalleryImagesBorder"]
          : [])
      ]
    },

    ".brz && .brz-image__gallery-item:hover .brz-ed-image__wrapper-container": {
      standart: ["cssStyleElementImageGalleryImagesBorder"]
    },

    ".brz && .brz-image__gallery-item:hover .brz-picture": {
      standart: [
        ...(IS_PREVIEW
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
    ".brz && .brz-image__gallery-item:hover .brz-ed-image__wrapper::after": {
      standart: [
        "cssStyleElementImageGalleryImagesOverlay",
        "cssStyleElementImageGalleryImagesGradient"
      ]
    },

    ".brz && .brz-image__gallery-item:hover .brz-picture::after": {
      standart: [
        ...(IS_PREVIEW
          ? [
              "cssStyleElementImageGalleryImagesOverlay",
              "cssStyleElementImageGalleryImagesGradient"
            ]
          : [])
      ]
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
        "cssStyleElementImageGalleryBigImageImagesCustomMask",
        ...(v.imagesMaskShape === "none"
          ? ["cssStyleElementImageGalleryImagesBorder"]
          : [])
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleForFilter(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
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
        "cssStyleElementImageGallery3LetterSpacing"
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

  return renderStyles({ v, vs, vd, styles });
}

export function styleBigImage(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
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

  return renderStyles({ v, vs, vd, styles });
}

export function styleWrapper(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
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

  return renderStyles({ v, vs, vd, styles });
}
