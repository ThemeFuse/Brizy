import React, { PropsWithChildren, ReactElement } from "react";
import { WithClassName, WithValue } from "visual/utils/options/attributes";

export type Props<T> = WithClassName &
  WithValue<T> &
  PropsWithChildren<unknown> & {
    title?: string;
    label?: string;
    icon?: string;
  };

export function Tab<T>({ children }: Props<T>): ReactElement {
  return <>{children}</>;
}
