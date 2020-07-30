import { PopulationMethod } from "visual/component/Options/types/common/Population/types/PopulationMethod";

export interface WithId<T> {
  id: T;
}

export type Size = "short" | "medium" | "large" | "auto";

export interface WithLabel {
  label?: string;
  icon?: string;
  display?: "inline" | "block";
}

export type HelperPlacement =
  | "top-start"
  | "top"
  | "top-end"
  | "right-start"
  | "right"
  | "right-end"
  | "bottom-end"
  | "bottom"
  | "bottom-start"
  | "left-end"
  | "left"
  | "left-start";

export interface WithHelper {
  helper?: {
    content: string;
    position?: HelperPlacement;
  };
}

export interface WithClassName {
  className?: string;
}

export interface WithPlaceholder {
  placeholder?: string;
}

export interface WithSize {
  size?: Size;
}

export interface WithConfig<T> {
  config?: T;
}

export interface WithPopulation {
  population?: PopulationMethod[];
}

export interface WithOnChange<T> {
  onChange: (v: T) => void;
}

export interface WithOnChange2<T, M> {
  onChange: (v: T, m: M) => void;
}

export interface WithValue<T> {
  value: T;
}
