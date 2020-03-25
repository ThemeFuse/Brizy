import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/utils/options/attributes";

export type Value = {
  number: number;
  unit: string;
};

export type Unit = {
  value: string;
  title: string;
};

export type Props = WithClassName &
  WithValue<Value> &
  WithOnChange<Value> & {
    step: number;
    min?: number;
    max?: number;
    units: Unit[];
  };
