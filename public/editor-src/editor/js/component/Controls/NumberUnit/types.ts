import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/utils/options/attributes";

export type Value<U> = {
  number: number;
  unit: U;
};

export type Unit<T> = {
  value: T;
  title: string;
};

export type Props<U> = WithClassName &
  WithValue<Value<U>> &
  WithOnChange<Value<U>> & {
    step: number;
    min?: number;
    max?: number;
    units: Unit<U>[];
  };
