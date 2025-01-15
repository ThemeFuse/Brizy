import type { EcwidToolbarCSSData } from "visual/editorComponents/Ecwid/utils/Value";
import type { OptionStyle, OptionStyleData } from "visual/utils/cssStyle/types";
import type { MValue } from "visual/utils/value";
import {
  footerIcon,
  footerIconWrapper,
  footerSelector,
  title2Selector,
  titleSelector
} from "./selectors";

export const getAlignFn =
  (selector: string): OptionStyle<"toggle"> =>
  ({ value: { value } }) => ({
    [selector]: {
      "text-align": value
    }
  });

export const getSpacingFn =
  (selector: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [selector]: {
      margin: `0 0 ${value}${unit} 0`
    }
  });

export const titleCssData: EcwidToolbarCSSData = {
  titleTypography: {
    selector: titleSelector
  },
  titleColor: {
    selector: titleSelector
  },
  titleHorizontalAlign: {
    style: getAlignFn(titleSelector)
  },
  titleSpacing: {
    style: getSpacingFn(titleSelector)
  }
};

export const title2CssData: EcwidToolbarCSSData = {
  title2Typography: {
    selector: title2Selector
  },
  title2Color: {
    selector: title2Selector
  },
  title2HorizontalAlign: {
    style: getAlignFn(title2Selector)
  },
  title2Spacing: {
    style: getSpacingFn(title2Selector)
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
