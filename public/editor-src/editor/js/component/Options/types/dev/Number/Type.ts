import {
  SimpleValue,
  Props as OptionProps
} from "visual/component/Options/Type";
import { FC } from "react";
import {
  WithClassName,
  WithConfig,
  WithSize
} from "visual/utils/options/attributes";

export type Config = WithSize & {
  min?: number;
  max?: number;
  step?: number;
  updateRate?: number;
  spinner: boolean;
};

export type Props = OptionProps<SimpleValue<number>> &
  WithConfig<Config> &
  WithClassName;

export type Component = FC<Props>;
