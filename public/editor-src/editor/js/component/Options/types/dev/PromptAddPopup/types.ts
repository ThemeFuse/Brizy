import type { Props as OptionProps } from "visual/component/Options/Type";
import type { WithConfig } from "visual/types/attributes";
import type { Block } from "visual/types/Block";

export interface Config {
  popupKey: string;
  canDelete?: boolean;
}

export interface Value {
  value: string;
  popups: Block[];
}

export type Props = OptionProps<Value> & WithConfig<Config>;
