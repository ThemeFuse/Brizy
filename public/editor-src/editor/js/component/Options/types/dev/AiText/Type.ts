import { FC } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName } from "visual/types/attributes";

export interface Model {
  value: string;
}

export interface Props extends OptionProps<Model>, WithClassName {
  selectedValue?: string;
}

export type Component = FC<Props>;
