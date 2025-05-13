import { OptionStyle } from "visual/utils/cssStyle/types";

export const titleAlignCSS: OptionStyle<"toggle"> = ({ value: { value } }) => ({
  "{{WRAPPER}} .brz-chart_title": {
    "justify-content": value
  }
});

export const widthCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}}": {
    width: `${value}${unit};`
  }
});
