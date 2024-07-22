import { ToMeta } from "visual/component/Options/Type";
import { isEmpty } from "./types/Value";

export interface Meta {
  isEmpty: boolean;
}

export const toMeta: ToMeta<"textShadow"> = (m) => ({
  isEmpty: isEmpty(m)
});
