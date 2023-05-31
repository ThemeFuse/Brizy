import { WithClassName } from "../types/attributes";

export interface Props extends WithClassName {
  value: number;
  onChange: (v: number, meta: { editing: boolean }) => void;
  step?: number;
  min?: number;
  max?: number;
}
