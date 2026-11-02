import React, { type PropsWithChildren, type ReactElement } from "react";
import type { WithValue } from "visual/types/attributes";

export type Props<T> = PropsWithChildren<
  WithValue<T> & {
    disabled?: boolean;
  }
>;

export function Item<T>({ children }: Props<T>): ReactElement {
  return <>{children}</>;
}
