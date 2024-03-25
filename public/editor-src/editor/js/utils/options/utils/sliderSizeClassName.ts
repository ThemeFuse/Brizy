import { Size } from "visual/component/Options/types/types";

export const sliderSizeClassName = (size?: Size) => {
  switch (size) {
    case "short":
      return "brz-ed__control--number-slider--short";
    case "medium":
      return "brz-ed__control--number-slider--medium";
    case "large":
      return "brz-ed__control--number-slider--large";
    default:
      return "";
  }
};
