import { FC } from "react";
import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { WithClassName, WithConfig, WithSize } from "visual/types/attributes";

export type Config = WithSize & {
  min?: number;
  max?: number;
  step?: number;
  updateRate?: number;
  spinner?: boolean;
};

export type Props = OptionProps<SimpleValue<number>> &
  WithConfig<Config> &
  WithClassName;

export type Component = FC<Props>;
