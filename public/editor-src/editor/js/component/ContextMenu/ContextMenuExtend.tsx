import React, { JSX, createContext, useMemo } from "react";
import { rolesHOC } from "visual/component/Roles";
import { ContextMenuItem } from "visual/editorComponents/EditorComponent/types";
import { FCC } from "visual/utils/react/types";

type ContextType = {
  getParentContextMenuExtendItems: () => ContextMenuItem[];
} | null;

export const ContextMenuExtendContext = createContext<ContextType>(null);

interface Props {
  getItems: () => ContextMenuItem[];
}

export const ContextMenuExtendProvider: FCC<Props> = ({
  getItems,
  children
}) => {
  const value = useMemo(
    () => ({ getParentContextMenuExtendItems: getItems }),
    [getItems]
  );

  return (
    <ContextMenuExtendContext.Provider value={value}>
      {children}
    </ContextMenuExtendContext.Provider>
  );
};

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuExtendProvider,
  fallbackRender: ({ children }: { children: JSX.Element }): JSX.Element =>
    children
});
