import { WithClassName, WithValue } from "visual/types/attributes";
import { Props as OptionProps } from "visual/component/Options/Type";

export interface Choice<T> {
  icon: string;
  title: string;
  value: T;
}

export interface Props<T> extends OptionProps<WithValue<T>>, WithClassName {
  choices: Choice<T>[];
}
