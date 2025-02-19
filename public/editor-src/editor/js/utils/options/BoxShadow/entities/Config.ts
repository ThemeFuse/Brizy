import { Type } from "./Type";

export interface Config {
  type?: Exclude<Type, "none">;
  opacity?: boolean;
  isPaletteHidden?: boolean;
}
