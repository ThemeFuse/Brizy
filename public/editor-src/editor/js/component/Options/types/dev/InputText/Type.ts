import type { FC } from "react";
import type { Props as OptionProps } from "visual/component/Options/Type";
import type { WithClassName } from "visual/types/attributes";

export interface Model {
  value: string;
}

export interface Props extends OptionProps<Model>, WithClassName {
  placeholder?: string;
}

export type Component = FC<Props>;
