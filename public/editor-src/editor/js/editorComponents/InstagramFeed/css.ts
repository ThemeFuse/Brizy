import { OptionStyle } from "visual/utils/cssStyle/types";

export const widthCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} iframe": {
    "min-width": `${value}${unit}!important`
  }
});
