import type { Style } from "./style";
import type { WidthType } from "./widthType";

export interface Config {
  opacity?: boolean;
  styles?: Style[];
  width?: WidthType[];
  isPaletteHidden?: boolean;
}
