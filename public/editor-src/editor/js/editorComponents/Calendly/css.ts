import { OptionStyle } from "visual/utils/cssStyle/types";

export const calendlySelector = "{{WRAPPER}}:hover .calendly-inline-widget";

export const getSizeCSSFn =
  (prop: "width" | "height"): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    "{{WRAPPER}}": {
      [prop]: `${value}${unit}`
    }
  });

export const hoverTransitionCSS: OptionStyle<"slider"> = ({
  value: { value }
}) => ({
  [calendlySelector]: {
    "transition-duration": `0.${value}s;`
  }
});
