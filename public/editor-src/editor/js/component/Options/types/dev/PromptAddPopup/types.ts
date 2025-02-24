import { Props as OptionProps } from "visual/component/Options/Type";
import { Block } from "visual/types/Block";
import { WithConfig } from "visual/types/attributes";

interface Config {
  popupKey: string;
  canDelete?: boolean;
}

export interface Value {
  value: string;
  popups: Block[];
}

export type Props = OptionProps<Value> & WithConfig<Config>;
