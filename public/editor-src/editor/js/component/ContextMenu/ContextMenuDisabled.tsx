import React, { JSX } from "react";
import { rolesHOC } from "visual/component/Roles";
import { FCC } from "visual/utils/react/types";
import { ContextMenuContext } from "./context";

const value = {
  getParentContextMenuExtendItems: () => [],
  getParentContextMenuItems: () => []
};

const ContextMenuDisabled: FCC = ({ children }) => (
  <ContextMenuContext.Provider value={value}>
    {children}
  </ContextMenuContext.Provider>
);

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuDisabled,
  fallbackRender: ({ children }: { children: JSX.Element }): JSX.Element =>
    children
});
