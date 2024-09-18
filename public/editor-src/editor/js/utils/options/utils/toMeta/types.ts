import { ToMeta } from "visual/component/Options/Type";
import { OptionName } from "visual/component/Options/types";
import { MValue } from "visual/utils/value";

export type ToMetaFns = {
  [K in OptionName]: MValue<ToMeta<K>>;
};
