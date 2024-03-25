import { ReactNode, isValidElement } from "react";
import { Size } from "visual/utils/options/attributes";
import { sliderSizeClassName } from "visual/utils/options/utils/sliderSizeClassName";
import { Element } from "./types/Element";
import { Value } from "./types/Value";

export const fromValue = (v: Value): Element => {
  return { value: v.value, suffix: v.unit };
};

export const sliderClassName = (label: ReactNode, size?: Size) => {
  if (isValidElement(label) && label.props.label) {
    return "brz-ed__control--number-slider--medium";
  }

  return sliderSizeClassName(size);
};
