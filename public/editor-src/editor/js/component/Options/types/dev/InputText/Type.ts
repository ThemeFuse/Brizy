import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import { FC } from "react";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

export interface Config {
  size?: "short" | "medium" | "large";
}

export interface Model {
  value: string;
}

export interface Props
  extends Option.Props<Model>,
    WithConfig<Config>,
    WithClassName {
  placeholder?: string;
}

export type Component = OptionType<Model> & FC<Props>;
