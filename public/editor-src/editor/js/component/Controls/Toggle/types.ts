import type { Props as OptionProps } from "visual/component/Options/Type";
import type { WithClassName, WithValue } from "visual/types/attributes";

export interface Choice<T> {
  icon: string;
  title: string;
  value: T;
}

export interface Props<T> extends OptionProps<WithValue<T>>, WithClassName {
  choices: Choice<T>[];
}
