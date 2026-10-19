import React, { useRef } from "react";
import type { ContextMenuProviderProps } from "./types";

const ContextMenu = ({ children }: ContextMenuProviderProps) => {
  const ref = useRef<HTMLElement>(null);
  return <>{typeof children === "function" ? children({ ref }) : children}</>;
};

export default ContextMenu;

export { default as ContextMenuDisabled } from "./ContextMenuDisabled";
export { default as ContextMenuExtend } from "./ContextMenuExtend";
