import { ToMeta } from "visual/component/Options/Type";
import type { Value } from "visual/component/Options/types/dev/Corners/types/Value";

export interface Meta {
  isGrouped: boolean;
  isUngrouped: boolean;
}

const isGrouped = (m: Value) => m.type === "grouped";
const isUngrouped = (m: Value) => m.type === "ungrouped";

export const toMeta: ToMeta<"corners"> = (m) => ({
  isGrouped: isGrouped(m),
  isUngrouped: isUngrouped(m)
});
