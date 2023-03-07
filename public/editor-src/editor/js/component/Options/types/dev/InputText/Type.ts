import { Props as OptionProps } from "visual/component/Options/Type";
import { FC } from "react";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

export interface Config {
  size?: "short" | "medium" | "large";
}

export interface Model {
  value: string;
}

export interface Props
  extends OptionProps<Model>,
    WithConfig<Config>,
    WithClassName {
  placeholder?: string;
}

export type Component = FC<Props>;
