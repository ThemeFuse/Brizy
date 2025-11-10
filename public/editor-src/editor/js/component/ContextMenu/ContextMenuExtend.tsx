import React, { type JSX, createContext, useMemo, useRef } from "react";
import { rolesHOC } from "visual/component/Roles";
import type { ContextMenuItem } from "visual/editorComponents/EditorComponent/types";
import type { FCC } from "visual/utils/react/types";

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
  const getItemsRef = useRef(getItems);
  getItemsRef.current = getItems;

  const value = useMemo(
    () => ({
      getParentContextMenuExtendItems: () => getItemsRef.current()
    }),
    []
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
