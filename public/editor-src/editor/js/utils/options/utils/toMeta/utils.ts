import type {
  OptionMeta,
  OptionName,
  OptionValue
} from "visual/component/Options/types";
import { MValue } from "visual/utils/value";
import { toMeta } from ".";

export const getOptionMeta = <T extends OptionName>(
  type: OptionName,
  v: OptionValue<T>
): MValue<Partial<OptionMeta<T>>> => toMeta(type)(v);
