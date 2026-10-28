import type { Attributes } from "react";
import type * as Option from "visual/component/Options/Type";
import type { WithClassName } from "visual/types/attributes";

export interface Attr extends Attributes {
  className: string;
}

export interface Props extends Option.Props<Color[]>, WithClassName {
  helper: string;
  helperContent: string;
  attr?: Attr;
}

export interface Color {
  hex: string;
}
