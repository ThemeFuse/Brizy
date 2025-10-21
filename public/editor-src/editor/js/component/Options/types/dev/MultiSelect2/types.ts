import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { WithConfig, WithSize } from "visual/types/attributes";
import { Literal } from "visual/utils/types/Literal";

export type ValueItem = Literal;

export type Value = ValueItem[];

export type ElementModelValue = SimpleValue<Literal[]>;

export type Config = WithSize & {
  search?: boolean;
  items?: number;
  scroll?: number;
  showArrow?: boolean;
  fetchOnMount?: boolean;
  // DO NOT USE THIS KEY, this key is used only in Posts element because we can't normally change form "multiSelect" to "select-dev" because of dynamically id and different data structure
  useAsSimpleSelect?: boolean;
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
