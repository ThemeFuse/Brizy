import React from "react";
import { hasTransform } from "./utils";

interface Props<T extends Record<string, unknown> = Record<string, unknown>> {
  v: T;
  children: JSX.Element;
}

export const TransformWrapper = <T extends Record<string, unknown>>({
  v,
  children
}: Props<T>): JSX.Element =>
  hasTransform(v) ? (
    <div className="brz-wrapper-transform">{children}</div>
  ) : (
    children
  );
