import { ToMeta } from "visual/component/Options/Type";
import { isEmpty, isNoEmptyGrouped } from "visual/utils/options/Margin/meta";

export interface Meta {
  isEmpty: boolean;
  isNoEmptyGrouped: boolean;
}

export const toMeta: ToMeta<"padding"> = (m) => ({
  isEmpty: isEmpty(m),
  isNoEmptyGrouped: isNoEmptyGrouped(m)
});
