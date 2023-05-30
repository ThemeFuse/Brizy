import { ReactElement } from "react";
import { NonEmptyArray } from "../types/array";
import { WithClassName, WithOnChange, WithValue } from "../types/attributes";
import { Props as ItemProps } from "./IconToggleItem";

export type Props<T> = WithClassName &
  WithValue<T> &
  WithOnChange<T> & {
    children: NonEmptyArray<ReactElement<ItemProps<T>>>;
  };
