import React from "react";
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
}: Props<T>): JSX.Element =>
  hasTransform(v) || needWrapper ? (
    <div className="brz-wrapper-transform">{children}</div>
  ) : (
    children
  );
