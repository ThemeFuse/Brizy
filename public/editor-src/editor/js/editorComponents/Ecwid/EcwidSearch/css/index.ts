import {
  getAlignFn,
  getSpacingFn
} from "visual/editorComponents/Ecwid/EcwidFavorites/css";
import type { EcwidToolbarCSSData } from "visual/editorComponents/Ecwid/utils/Value";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getColor } from "visual/utils/color";
import type { OptionStyle, OptionStyleData } from "visual/utils/cssStyle/types";
import type { MValue } from "visual/utils/value";
import {
  dropdownTitleHeadTextSelector,
  dropdownTitleSelector,
  filtersProductsSelector,
  filtersResultsSelector,
  footerIcon,
  footerIconWrapper,
  footerSelector,
  formControlSelector,
  popupInputSelectorMobile,
  productCardSelector,
  rangeSelector,
  sortBySelectSelector,
  titlePopupFilterItemSelectorMobile,
  titleSelector,
  titleSelectorMobile
} from "./selectors";

export const titleCSSData: EcwidToolbarCSSData = {
  titleTypography: {
    selector: `${titleSelector}, ${titleSelectorMobile}, ${titlePopupFilterItemSelectorMobile}`
  },
  titleColor: {
    selector: `${titleSelector}, ${titleSelectorMobile}, ${titlePopupFilterItemSelectorMobile}`
  },
  titleHorizontalAlign: {
    style: getAlignFn(
      `${titleSelector}, ${titleSelectorMobile}, ${titlePopupFilterItemSelectorMobile}`
    )
  },
  titleSpacing: {
    style: getSpacingFn(
      `${titleSelector}, ${titleSelectorMobile}, ${titlePopupFilterItemSelectorMobile}`
    )
  }
};

export const footerCssData: EcwidToolbarCSSData = {
  footerTypography: {
    selector: footerSelector
  },
  footerColor: {
    selector: footerSelector
  },
  footerIconColor: {
    selector: footerIcon
  },
  footerSpacing: {
    style: getSpacingFn(footerIconWrapper)
  },
  footerIconSize: {
    style: ({ value: { value } }: OptionStyleData<"radioGroup">) => {
      let size: MValue<number>;

      switch (value) {
        case "small":
          size = 16;
          break;
        case "medium":
          size = 24;
          break;
        case "large":
          size = 32;
          break;
      }

      if (size) {
        return {
          [footerIcon]: {
            width: `${size}px`,
            height: `${size}px`
          }
        };
      }
    }
  },
  footerIconCustomSize: {
    style: ({ value: { value, unit } }: OptionStyleData<"slider">) => ({
      [footerIcon]: {
        width: `${value}${unit}`,
        height: `${value}${unit}`
      }
    })
  }
};

export const dropdownTitleAlignCSS: OptionStyle<"toggle"> = ({
  value: { value }
}) => ({
  [`${dropdownTitleSelector}, ${filtersResultsSelector}, ${dropdownTitleHeadTextSelector}`]:
    {
      "justify-content": `${value} !important`
    }
});

export const inputsHeightCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [`${formControlSelector}:not(.form-control--checkbox) input, ${popupInputSelectorMobile}`]:
    {
      height: `${value}${unit}`
    }
});

export const getRangeEmptyColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => ({
    [`${rangeSelector} .ec-range__track-line, ${rangeSelector} .ec-range__track-line::before, ${rangeSelector} .ec-range__track-line::after`]:
      {
        "background-color": getColor(palette, hex, opacity, config) ?? ""
      }
  });

export const getRangeFilledColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config) ?? "";

    return {
      [`${rangeSelector} .ec-range__runner, ${rangeSelector} .ec-range__slider`]:
        {
          "background-color": color,
          "border-color": color
        }
    };
  };

export const skuSpacingCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [`${productCardSelector} .grid-product__sku-inner`]: {
    "margin-top": `${value}${unit}`
  }
});

export const getSpacingCSS =
  (align: "LEFT" | "RIGHT"): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [filtersProductsSelector]:
      align === "LEFT"
        ? {
            "margin-left": `${value}${unit}`,
            "margin-right": 0
          }
        : {
            "margin-right": `${value}${unit}`,
            "margin-left": 0
          }
  });

export const getSelectBgColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return {
        [`${sortBySelectSelector} select option`]: {
          "background-color": color
        }
      };
    }
  };

export const subtitleSpacingCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [`${productCardSelector} .grid-product__subtitle-inner`]: {
    "margin-top": `${value}${unit}`
  }
});
