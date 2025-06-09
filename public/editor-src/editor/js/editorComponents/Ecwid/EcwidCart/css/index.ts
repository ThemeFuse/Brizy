import { getColorToolbar } from "visual/utils/color";
import { OptionStyle } from "visual/utils/cssStyle/types";
import {
  cartBodySelector,
  checkoutEmailIconSelector,
  inputsSelector,
  nextTitleSelector
} from "./selectors";

export const textAlignCSS =
  (selectors: string[]): OptionStyle<"toggle"> =>
  ({ value: { value } }) => ({
    [selectors.join(",")]: {
      "text-align": value
    }
  });

export const checkoutEmailBorderCSS: OptionStyle<"colorPicker"> = ({
  value: { hex, opacity, palette }
}) => {
  const color = getColorToolbar(palette, hex, opacity);

  if (color) {
    return {
      [checkoutEmailIconSelector]: {
        "border-color": color
      }
    };
  }
};

export const sidebarSpacingCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [cartBodySelector]: {
    "margin-left": `${value}${unit}`
  }
});

export const nextSpacingCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [nextTitleSelector]: {
    "padding-top": `${value}${unit}`
  }
});

export const inputsHeightCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [inputsSelector]: {
    height: `${value}${unit}`
  }
});
