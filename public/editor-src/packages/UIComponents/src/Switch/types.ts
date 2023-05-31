import { WithClassName, WithOnChange, WithValue } from "../types/attributes";

export interface Props
  extends WithClassName,
    WithOnChange<boolean>,
    WithValue<boolean> {
  theme?: "dark" | "light";
}
