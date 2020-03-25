import { OrPromise } from "visual/component/Options/types/dev/MultiSelect/utils";
import { Props as P } from "visual/component/Options/Type";
import { Value } from "./Value";
import { WithConfig } from "visual/utils/options/attributes";

export type InputType = {
  title: string;
  icon?: string;
  value: Value;
};

export type Config = {
  search: boolean;
  items: number;
  scroll: number;
  size: "short" | "medium" | "large" | "full";
};

export type Props = P<Value[], { value: Value }> &
  WithConfig<Config> & {
    choices: OrPromise<InputType[], Value>;
    placeholder?: string;
  };
