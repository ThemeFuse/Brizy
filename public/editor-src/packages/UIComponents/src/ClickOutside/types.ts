import { ReactElement, RefObject } from "react";

type FunctionalException = (el: HTMLElement) => boolean;

export type Exception = string | FunctionalException;

export type Acc = {
  functionExceptions: FunctionalException[];
  stringExceptions: string[];
};

export interface Props<T extends HTMLElement> {
  children: (ref: RefObject<T>) => ReactElement;
  exceptions: Exception[];
  onClickOutside: (e: MouseEvent) => void;
}
