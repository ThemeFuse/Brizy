import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from ".";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data.contexts;
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleSizeWidth",
        "cssStyleSizeHeight",
        "cssStyleElementTranslationAlign"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    // #region select css
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleElementTranslationAlign",
        "cssStyleBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&": {
      standart: ["cssStyleSizeHeight", "cssStyleSizeWidth"]
    },
    ".brz && .select2-selection .select2-selection__rendered .brz-translation__select-item .brz-span":
      {
        standart: ["cssStyleElementTranslationTextSpacing"]
      },
    ".brz && .select2-selection": {
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
      { standart: ["cssStyleElementTranslationPreviewArrowColorOpen"] },
    // #endregion

    // #region dropdown css
    ".brz && .select2-dropdown .select2-results__option .brz-translation__select-item .brz-span":
      { standart: ["cssStyleElementTranslationTextSpacing"] },
    ".brz && .select2-dropdown .select2-results__option .brz-translation__select-item .brz-translation__flag":
      {
        standart: [
          "cssStyleElementTranslationFlagSpacing",
          "cssStyleElementTranslationFlagSize"
        ]
      },
    ".brz && .select2-dropdown:hover": {
      standart: [
        "cssStyleElementTranslationBoxShadow",
        "cssStyleElementTranslationWidth"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .select2-dropdown .select2-results__option ": {
      standart: ["cssStyleElementTranslationAlign"]
    }
    // #endregion
  };

  return renderStyles({
    ...data,
    styles: isEditor(renderContext) ? styles : styleSelectView
  });
}

export function styleDropdown(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz && .brz-translation__select-list:hover": {
      standart: ["cssStyleElementTranslationBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
          "cssStyleTypography2FontVariation",
          "cssStyleTextTransforms",
          "cssStyleElementTranslationColor",
          "cssStyleElementTranslationBgColor",
          "cssStyleElementTranslationBorder",
          "cssStyleSizeHeight",
          "cssStyleElementTranslationAlign"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-translation__select-list .brz-translation__select-item .brz-span":
      { standart: ["cssStyleElementTranslationTextSpacing"] },
    ".brz && .brz-translation__select-list .brz-translation__select-item .brz-translation__flag":
      {
        standart: [
          "cssStyleElementTranslationFlagSize",
          "cssStyleElementTranslationFlagSpacing"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
