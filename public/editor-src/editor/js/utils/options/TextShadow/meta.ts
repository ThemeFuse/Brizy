import { ToMeta } from "visual/component/Options/Type";
import { isEmpty } from "visual/component/Options/types/dev/TextShadow/types/Value";

export interface Meta {
  isEmpty: boolean;
}

export const toMeta: ToMeta<"textShadow"> = (m) => ({
  isEmpty: isEmpty(m)
});
