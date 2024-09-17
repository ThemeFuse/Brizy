import * as Option from "visual/component/Options/Type";
import { Attributes } from "react";
import { WithClassName } from "visual/types/attributes";

interface Attr extends Attributes {
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
