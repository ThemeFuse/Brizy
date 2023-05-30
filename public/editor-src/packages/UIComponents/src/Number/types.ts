import { WithClassName, WithSize } from "../types/attributes";

export type Action = "increase" | "decrease" | "none";

export interface Props extends WithClassName, WithSize {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onIncrease: VoidFunction;
  onDecrease: VoidFunction;
  showArrows?: boolean;
}
