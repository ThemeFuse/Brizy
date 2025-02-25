import { getColorToolbar } from "visual/utils/color";
import { OptionStyle } from "visual/utils/cssStyle/types";
import { checkoutEmailIconSelector } from "./selectors";

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
