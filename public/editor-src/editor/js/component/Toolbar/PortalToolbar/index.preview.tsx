import { noop } from "es-toolkit";
import React from "react";
import type { PortalToolbarProps } from "./types";

export default function PortalToolbar({
  children
}: PortalToolbarProps): JSX.Element {
  return typeof children === "function" ? (
    children({ ref: null, open: noop })
  ) : (
    <>{children}</>
  );
}
