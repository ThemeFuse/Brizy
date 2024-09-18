import React, { PropsWithChildren, ReactElement } from "react";
import { WithValue } from "visual/types/attributes";

export type Props<T> = PropsWithChildren<
  WithValue<T> & {
    disabled?: boolean;
  }
>;

export function Item<T>({ children }: Props<T>): ReactElement {
  return <>{children}</>;
}
