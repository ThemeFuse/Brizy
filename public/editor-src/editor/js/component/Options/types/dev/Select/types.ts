import {
  Props as OptionProps,
  OptionType
} from "visual/component/Options/Type";
import { WithConfig, WithSize } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";
import { SimpleValue } from "visual/component/Options/Type";

export type ElementModelValue = SimpleValue<Literal>;

export type Choice = {
  icon?: string;
  title: string;
  value: Literal;
};

export type Config = WithSize & {
  search: boolean;
  items: number;
  scroll: number;
};

export type ChoicesSync = Choice[];

export type ChoicesAsync = {
  load: (abortSignal?: AbortSignal) => Promise<Choice[]>;
};

export type Props = OptionProps<ElementModelValue> &
  WithConfig<Config> & {
    choices: ChoicesSync | ChoicesAsync;
    placeholder?: string;
  };

export type StaticProps = OptionType<ElementModelValue>;
