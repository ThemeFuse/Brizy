import {
  PopulationMethod,
  PopulationMethodHandler,
  PopulationOptgroupMethod
} from "visual/component/Options/types/common/Population/types/PopulationMethod";
import { mPipe, pass } from "visual/utils/fp";
import { isObject, readKey } from "visual/utils/reader/object";
import { isT } from "visual/utils/value";

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
  population?: {
    choices?: Array<PopulationMethod | PopulationOptgroupMethod>;
    handlerChoices?: PopulationMethodHandler["handlerChoices"];
  };
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

export const hasValue = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: Record<string, any>,
  check?: (o: unknown) => o is T
): o is WithValue<T> =>
  mPipe(pass(isObject), readKey("value"), pass(check ?? isT))(o) !== undefined;
