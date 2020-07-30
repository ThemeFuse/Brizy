import { Props as P } from "visual/component/Options/Type";
import { Value } from "./Value";
import { WithConfig, WithSize } from "visual/utils/options/attributes";

export type InputType = {
  title: string;
  icon?: string;
  value: Value;
};

export type Config = WithSize & {
  search: boolean;
  items: number;
  scroll: number;
};

export type Props = P<Value[], { value: Value }> &
  WithConfig<Config> & {
    choices: InputType[];
    placeholder?: string;
  };
