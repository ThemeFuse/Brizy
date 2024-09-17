import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/types/attributes";

export interface Choices {
  value: string;
  title: string;
  icon?: string;
}

interface Config {
  label: JSX.Element;
  icon: string;
  title: string;
  helper: boolean;
  helperContent: string;
  choices: Choices[];
  onChange: VoidFunction;
}

export type Props = OptionProps<SimpleValue<boolean>> &
  WithConfig<Config> &
  WithClassName;
