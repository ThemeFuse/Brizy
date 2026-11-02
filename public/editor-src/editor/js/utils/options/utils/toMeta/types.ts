import type { ToMeta } from "visual/component/Options/Type";
import type { OptionName } from "visual/component/Options/types";
import type { MValue } from "visual/utils/value";

export type ToMetaFns = {
  [K in OptionName]: MValue<ToMeta<K>>;
};
