import React, { ReactElement } from "react";
import { TabProps as Props } from "../types";

export function Tab<T>({ children }: Props<T>): ReactElement {
  return <>{children}</>;
}
