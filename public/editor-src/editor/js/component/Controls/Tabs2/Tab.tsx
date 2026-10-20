import React, { type PropsWithChildren, type ReactElement } from "react";
import type { WithClassName, WithValue } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";

export type Props<T extends Literal> = WithClassName &
  WithValue<T> &
  PropsWithChildren<unknown> & {
    title?: string;
    label?: string;
    icon?: string;
  };

export function Tab<T extends Literal>({ children }: Props<T>): ReactElement {
  return <>{children}</>;
}
