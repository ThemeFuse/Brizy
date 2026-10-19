import type { Unit } from "visual/component/Controls/NumberUnit/types";
import type { Size } from "visual/types/attributes";

export type Config = {
  min?: number;
  max?: number;
  step?: number;
  debounceUpdate?: boolean;
  updateRate?: number;
  inputMin?: number;
  inputMax?: number;
  units?: Unit<string>[];
  size?: Size;
};
