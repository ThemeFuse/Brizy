import { Props as OptionType } from "visual/component/Options/Type";
import { Value } from "./Value";
import { WithConfig, WithSize } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";

export type Choice = {
  title: string;
  icon?: string;
  value: Literal;
};

export type Config = WithSize & {
  search: boolean;
  items: number;
  scroll: number;
};

export type ChoicesSync = Choice[];

export type ChoicesAsync = {
  load: (value: Value["value"], abortSignal?: AbortSignal) => Promise<Choice[]>;
  search: (search: string, abortSignal?: AbortSignal) => Promise<Choice[]>;
};

export type Props = OptionType<Value> &
  WithConfig<Config> & {
    choices: ChoicesSync | ChoicesAsync;
    placeholder?: string;
  };
