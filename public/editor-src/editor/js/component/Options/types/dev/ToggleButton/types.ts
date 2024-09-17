import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { Literal } from "visual/utils/types/Literal";

type Type = "square" | "default";

interface Config {
  icon?: string;
  title?: string;
  type?: Type;
  width?: number;
  height?: number;
  reverseTheme?: boolean;
  on?: Literal;
  off?: Literal;
}

export type Align = "left" | "center" | "right";

type ToggleConverter = Literal | boolean | undefined;

interface Value extends WithClassName {
  onChange: (value: { value: ToggleConverter }) => void;
  children?: JSX.Element;
  align?: Align;
  config: Config;
  label?: string;
  value: { value: ToggleConverter };
}

export type Props = OptionProps<SimpleValue<Literal>> &
  WithConfig<Config> &
  Value;
