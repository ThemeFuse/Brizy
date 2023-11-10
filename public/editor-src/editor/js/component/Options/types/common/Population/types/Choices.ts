import { Literal } from "visual/utils/types/Literal";

export interface Choices<T extends Literal> {
  value: T;
  title: string;
  icon?: string;
}

export interface OptGroup<T extends Literal> {
  title: string;
  icon?: string;
  optgroup: (Choices<T> | OptGroup<T>)[];
}
