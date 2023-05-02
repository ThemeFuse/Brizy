import { WithClassName } from "../types/attributes";

export interface Props extends WithClassName {
  onClick?: VoidFunction;
  children: React.ReactNode;
}
