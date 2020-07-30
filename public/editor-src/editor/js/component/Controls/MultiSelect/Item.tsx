import React, { PropsWithChildren, ReactElement } from "react";
import { WithValue } from "visual/utils/options/attributes";

export type Props<T> = PropsWithChildren<WithValue<T>>;

export function Item<T>({ children }: Props<T>): ReactElement {
  return <>{children}</>;
}
