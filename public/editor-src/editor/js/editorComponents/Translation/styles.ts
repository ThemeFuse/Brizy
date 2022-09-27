import { renderStyles } from "visual/utils/cssStyle";
import { Value } from ".";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing",

        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        // "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleSizeWidth",
        "cssStyleSizeHeight"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTranslationPropertyHoverTransition"
      ]
    },
    ".brz && .brz-span": {
      standart: ["cssStyleElementTranslationTextSpacing"]
    },
    ".brz && .brz-translation__flag": {
      standart: [
        "cssStyleElementTranslationFlagSize",
        "cssStyleElementTranslationFlagSpacing"
      ]
    }
  };

  const styleSelectView = {
    ".brz &&:hover .brz-span": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },

    // #region select css
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTranslationPropertyHoverTransition"
      ]
    },
    ".brz &&": {
      standart: ["cssStyleSizeHeight", "cssStyleSizeWidth"]
    },
    ".brz && .select2-selection .select2-selection__rendered .brz-translation__select-item .brz-span":
      {
        standart: ["cssStyleElementTranslationTextSpacing"]
      },
    ".brz && .select2-selection .brz-translation__select-item": {
      standart: ["cssStyleSizeHeight"]
    },
    ".brz && .select2-selection .select2-selection__rendered .brz-translation__select-item .brz-translation__flag":
      {
        standart: [
          "cssStyleElementTranslationFlagSpacing",
          "cssStyleElementTranslationFlagSize"
        ]
      },
    ".brz &&:hover .select2-selection .select2-selection__arrow b": {
      standart: ["cssStyleElementTranslationPreviewArrowColorClosed"]
    },
    ".brz &&:hover .select2-container--open .select2-selection .select2-selection__arrow b":
      {
        standart: ["cssStyleElementTranslationPreviewArrowColorOpen"]
      },
    // #endregion

    // #region dropdown css
    ".brz && .select2-dropdown .select2-results__option .brz-translation__select-item .brz-span":
      {
        standart: ["cssStyleElementTranslationTextSpacing"]
      },
    ".brz && .select2-dropdown .select2-results__option .brz-translation__select-item .brz-translation__flag":
      {
        standart: [
          "cssStyleElementTranslationFlagSpacing",
          "cssStyleElementTranslationFlagSize"
        ]
      },
    ".brz && .select2-dropdown:hover": {
      standart: ["cssStyleElementTranslationBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTranslationPropertyHoverTransition"
      ]
    },
    ".brz && .select2-results__options .select2-results__option:hover": {
      standart: [
        "cssStyleElementTranslationColor",
        "cssStyleElementTranslationBgColor",
        "cssStyleElementTranslationBorder",
        "cssStyleSizeHeight"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTranslationPropertyHoverTransition"
      ]
    }
    // #endregion
  };

  return renderStyles({
    v,
    vs,
    vd,
    styles: IS_EDITOR ? styles : styleSelectView
  });
}

export function styleDropdown(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz && .brz-translation__select-list:hover": {
      standart: ["cssStyleElementTranslationBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTranslationPropertyHoverTransition"
      ]
    },
    ".brz && .brz-translation__select-list .brz-translation__select-item:hover":
      {
        standart: [
          "cssStyleTypography2FontFamily",
          "cssStyleTypography2FontWeight",
          "cssStyleTypography2FontSize",
          "cssStyleTypography2LineHeight",
          "cssStyleTypography2LetterSpacing",
          "cssStyleElementTranslationColor",
          "cssStyleElementTranslationBgColor",
          "cssStyleElementTranslationBorder",
          "cssStyleSizeHeight"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStyleElementTranslationPropertyHoverTransition"
        ]
      },
    ".brz && .brz-translation__select-list .brz-translation__select-item .brz-span":
      {
        standart: ["cssStyleElementTranslationTextSpacing"]
      },
    ".brz && .brz-translation__select-list .brz-translation__select-item .brz-translation__flag":
      {
        standart: [
          "cssStyleElementTranslationFlagSize",
          "cssStyleElementTranslationFlagSpacing"
        ]
      }
  };

  return renderStyles({
    v,
    vs,
    vd,
    styles
  }) as [string, string, string];
}
