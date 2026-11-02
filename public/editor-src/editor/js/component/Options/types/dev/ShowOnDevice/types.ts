import type {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import type { WithClassName } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";

export interface Choice {
  icon: string;
  title: string;
  value: Literal;
}
export interface Props
  extends OptionProps<SimpleValue<Literal>>,
    WithClassName {
  choices: Choice[];
  closeTooltip?: boolean;
}
