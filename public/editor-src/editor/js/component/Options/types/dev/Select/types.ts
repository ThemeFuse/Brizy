import { Props as OptionProps } from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { WithConfig, WithSize } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";

export type ElementModelValue = SimpleValue<Literal>;

export type Choice = {
  icon?: {
    name?: string;
    className?: string;
  };
  title: string;
  value: Literal;
};

export type Config = WithSize & {
  search?: boolean;
  items?: number;
  scroll?: number;
  autoClose?: boolean;
};

export type ChoicesSync = Choice[];

export type ChoicesAsync = {
  load: (abortSignal?: AbortSignal) => Promise<Choice[]>;
  emptyLoad?: {
    title?: string;
  };
};

export type Props = OptionProps<ElementModelValue> &
  WithConfig<Config> & {
    choices: ChoicesSync | ChoicesAsync;
    placeholder?: string;
    className?: string;
    iconClassName?: string;
    onLoad?: VoidFunction;
  };
