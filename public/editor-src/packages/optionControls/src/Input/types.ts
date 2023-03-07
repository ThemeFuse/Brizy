import { WithClassName, WithSize } from "./../types/attributes";

export interface Props extends WithClassName, WithSize {
  value?: string;
  onChange: (v: string) => void;
  onBlur?: VoidFunction;
  placeholder?: string;
}
