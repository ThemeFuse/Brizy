import { noop } from "es-toolkit";
import type { ReactNode } from "react";
import type { PortalToolbarProps } from "./types";

export default function PortalToolbar({
  children
}: PortalToolbarProps): ReactNode {
  return typeof children === "function"
    ? children({ ref: null, open: noop })
    : children;
}
