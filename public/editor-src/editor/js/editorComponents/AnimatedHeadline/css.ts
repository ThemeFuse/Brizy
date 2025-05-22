import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getColor } from "visual/utils/color";
import { OptionStyle } from "visual/utils/cssStyle/types";

export const shapeStrokeCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, opacity, hex } }) => ({
    "{{WRAPPER}} .brz-animatedHeadline--style-svg svg path": {
      stroke: getColor(palette, hex, opacity, config) ?? ""
    }
  });

export const shapeWidthCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-animatedHeadline--style-svg svg path": {
    "stroke-width": `${value}${unit}`
  }
});

export const shapeDurationCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-animatedHeadline--style-svg svg": {
    "--animation-duration": `${value}${unit}`
  }
});

export const alignContentCSS: OptionStyle<"toggle"> = ({ value }) => ({
  "{{WRAPPER}}.brz-animatedHeadline--wrapper": {
    "justify-content": value.value
  }
});

export const transitionCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-animatedHeadline-plain-text, {{WRAPPER}} .brz-animatedHeadline-typing-selected > span, {{WRAPPER}} .brz-animatedHeadline--style-svg svg path":
    {
      "transition-duration": `${value}${unit}`
    }
});
