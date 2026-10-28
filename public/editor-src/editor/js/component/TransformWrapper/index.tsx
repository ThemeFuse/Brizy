import React, { type ReactNode } from "react";
import { useStore } from "react-redux";
import type { ReduxAction } from "visual/redux/actions2";
import type { ReduxState } from "visual/redux/types";
import { hasTransform } from "./utils";

interface Props<T extends Record<string, unknown> = Record<string, unknown>> {
  v: T;
  className: string;
  children: ReactNode;
  needWrapper?: boolean;
}

export const TransformWrapper = <T extends Record<string, unknown>>({
  v,
  className,
  children,
  needWrapper
}: Props<T>): ReactNode => {
  const store = useStore<ReduxState, ReduxAction>();

  return hasTransform(v, store) || needWrapper ? (
    <div className={className}>{children}</div>
  ) : (
    children
  );
};
