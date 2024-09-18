import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
import { WithClassName } from "visual/types/attributes";

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
