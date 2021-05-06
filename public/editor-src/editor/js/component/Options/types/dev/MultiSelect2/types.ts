import {
  OptionType,
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { WithConfig, WithSize } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";

export type ValueItem = Literal;

export type Value = ValueItem[];

export type ElementModelValue = SimpleValue<Literal[]>;

export type Config = WithSize & {
  search: boolean;
  items: number;
  scroll: number;
};

export type Choice = {
  title: string;
  value: Literal;
};

export type ChoicesSync = Choice[];

export type ChoicesAsync = {
  load: (value: Value, abortSignal?: AbortSignal) => Promise<Choice[]>;
  search: (search: string, abortSignal?: AbortSignal) => Promise<Choice[]>;
};

export type Props = OptionProps<ElementModelValue> &
  WithConfig<Config> & {
    choices: ChoicesSync | ChoicesAsync;
    placeholder?: string;
  };

export type StaticProps = OptionType<ElementModelValue>;
