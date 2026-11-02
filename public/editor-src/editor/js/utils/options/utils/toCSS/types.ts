import type { OptionMeta, OptionValue } from "visual/component/Options/types";
import type { MValue } from "visual/utils/value";
import type { fns } from "./index";

export type OptionNameWithStyles = keyof typeof fns;

export interface ToCSSData<
  T extends OptionNameWithStyles = OptionNameWithStyles
> {
  model: OptionValue<T>;
  meta: MValue<Partial<OptionMeta<T>>>;
}
