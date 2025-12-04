import React from "react";
import { useStore } from "react-redux";
import { ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { hasTransform } from "./utils";

interface Props<T extends Record<string, unknown> = Record<string, unknown>> {
  v: T;
  children: JSX.Element;
  needWrapper?: boolean;
}

export const TransformWrapper = <T extends Record<string, unknown>>({
  v,
  children,
  needWrapper
}: Props<T>): JSX.Element => {
  const store = useStore<ReduxState, ReduxAction>();

  return hasTransform(v, store) || needWrapper ? (
    <div className="brz-wrapper-transform">{children}</div>
  ) : (
    children
  );
};
