import React, { useRef } from "react";
import { ContextMenuProviderProps } from "./types";

const ContextMenu = ({ children }: ContextMenuProviderProps) => {
  const ref = useRef<HTMLElement>(null);
  return <>{typeof children === "function" ? children({ ref }) : children}</>;
};

export default ContextMenu;

export { default as ContextMenuExtend } from "./ContextMenuExtend";
export { default as ContextMenuDisabled } from "./ContextMenuDisabled";
