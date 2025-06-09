import { PriceStyle } from "@brizy/widget/src/Shopify/Price/types";
import { OptionStyle } from "visual/utils/cssStyle/types";
import { priceSelector } from "./selectors";

export * from "./selectors";

export const getSpacingCSSFn =
  (style: PriceStyle): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => {
    if (style === PriceStyle.S1) {
      return {
        [priceSelector]: { "margin-inline-end": `${value}${unit};` }
      };
    }
  };

export const getWidthCSSFn =
  (selector: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [selector]: {
      "min-width": `${value}${unit};`
    }
  });

export const getHeightCSSFn =
  (selector: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [selector]: {
      "min-height": `${value}${unit};`
    }
  });
