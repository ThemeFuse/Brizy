import { ReactNode } from "react";
import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

interface Config {
  icon: string;
  title: string;
  reverseTheme: boolean;
}

interface Value extends WithClassName {
  onChange: (value: boolean) => void;
  children?: ReactNode;
  align?: "left" | "center" | "right";
  config: Config;
  value: { value: boolean };
}

export type Props = OptionProps<SimpleValue<boolean>> &
  WithConfig<Config> &
  Value;
