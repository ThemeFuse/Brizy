import { OptionStyle } from "visual/utils/cssStyle/types";

export const titleAlignCSS: OptionStyle<"toggle"> = ({ value: { value } }) => ({
  "{{WRAPPER}} .brz-chart_title": {
    "justify-content": value
  }
});

export const titleHoverTransitionCSS: OptionStyle<"slider"> = ({
  value: { value }
}) => ({
  "{{WRAPPER}} .brz-chart_title": {
    "transition-duration": `0.${value}s;`
  }
});

export const widthCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}}": {
    width: `${value}${unit};`
  }
});
