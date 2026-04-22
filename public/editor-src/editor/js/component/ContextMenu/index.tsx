import React, {
  type FC,
  type MutableRefObject,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { rolesHOC } from "visual/component/Roles";
import { ContextMenuExtendContext } from "./ContextMenuExtend";
import { Dropdown } from "./Dropdown";
import { ContextMenuContext } from "./context";
import type { ComponentMenuEntry, Item, MenuPosition, Meta } from "./types";
import type { ContextMenuProviderProps } from "./types";
import { filterItems, mergeItems } from "./utils";

const meta: Meta = {
  depth: 0,
  isInSubMenu: false
};

interface ContextMenuWrapperProps {
  children: ReactNode;
  elementRef: MutableRefObject<HTMLElement | null>;
  onContextMenu?: () => void;
  onTrigger: (pos: MenuPosition) => void;
}

// this component is needed to avoid ContextMenuProvider to render a wrapper div  because that breaks our layout
const ContextMenuWrapper = ({
  children,
  elementRef,
  onContextMenu,
  onTrigger
}: ContextMenuWrapperProps) => {
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();

        const iframe = parent.document.querySelector("#brz-ed-iframe");
        if (!iframe) {
          return;
        }
        const iframeBounding = iframe.getBoundingClientRect();

        if (onContextMenu) {
          onContextMenu();
        }

        onTrigger({
          x: e.clientX + iframeBounding.x,
          y: e.clientY + iframeBounding.y
        });
      }
    },
    [onContextMenu, onTrigger]
  );

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      element.addEventListener(
        "contextmenu",
        handleContextMenu as EventListener
      );
    }

    return () => {
      if (element) {
        element.removeEventListener(
          "contextmenu",
          handleContextMenu as EventListener
        );
      }
    };
  }, [handleContextMenu, elementRef]);

  return <>{children}</>;
};

function squashItems(entries: ComponentMenuEntry[]): Item[] {
  return entries.reduce(
    (
      acc: { componentIdMap: Record<string, boolean>; items: Item[] },
      { componentId: id, items }
    ) => {
      if (!acc.componentIdMap[id]) {
        acc.componentIdMap[id] = true;
        acc.items = acc.items.concat(items);
      }

      return acc;
    },
    {
      componentIdMap: {},
      items: []
    }
  ).items;
}

export const ContextMenuProvider: FC<ContextMenuProviderProps> = ({
  getItems: _getItems,
  children,
  componentId,
  onContextMenu
}) => {
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const contextExtend = useContext(ContextMenuExtendContext);
  const { getParentContextMenuItems } = useContext(ContextMenuContext);

  const getItems = useCallback((): ComponentMenuEntry[] => {
    const rawItems: Item[] = _getItems();

    const mergedItems: Item[] = contextExtend
      ? mergeItems(rawItems, contextExtend.getParentContextMenuExtendItems())
      : rawItems;

    const entry: ComponentMenuEntry = { componentId, items: mergedItems };

    return [entry, ...getParentContextMenuItems()];
  }, [_getItems, getParentContextMenuItems, contextExtend, componentId]);

  const getSquashedItems = useCallback((): Item[] => {
    const items = squashItems(getItems());
    return filterItems(items, meta);
  }, [getItems]);

  const value = useMemo(
    () => ({
      getParentContextMenuItems: getItems
    }),
    [getItems]
  );

  const root = useMemo((): HTMLElement | undefined => {
    if (portalRootRef.current) {
      return portalRootRef.current;
    }

    if (typeof window !== "undefined") {
      const rootClassName = "brz-context-menu__root";
      const node = window.parent.document.querySelector<HTMLElement>(
        `.${rootClassName}`
      );

      if (node) {
        portalRootRef.current = node;
        return node;
      }

      const newRoot = document.createElement("div");
      newRoot.className = rootClassName;
      portalRootRef.current = newRoot;
      window.parent.document.body.appendChild(newRoot);
      return newRoot;
    }
  }, []);

  const handleClose = useCallback(() => {
    setMenuPosition(null);
  }, []);

  const childrenTree = useMemo(
    () => (
      <ContextMenuWrapper
        elementRef={triggerElementRef}
        onContextMenu={onContextMenu}
        onTrigger={setMenuPosition}
      >
        {typeof children === "function"
          ? children({ ref: triggerElementRef })
          : children}
      </ContextMenuWrapper>
    ),
    [children, onContextMenu]
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {childrenTree}
      {root && menuPosition && (
        <Dropdown
          menuPosition={menuPosition}
          getItems={getSquashedItems}
          itemsMeta={meta}
          root={root}
          onClose={handleClose}
        />
      )}
    </ContextMenuContext.Provider>
  );
};

export default rolesHOC({
  allow: ["admin"],
  component: ContextMenuProvider,
  fallbackRender: ({ children }: { children: JSX.Element }): JSX.Element =>
    children
});

export { default as ContextMenuExtend } from "./ContextMenuExtend";
export { default as ContextMenuDisabled } from "./ContextMenuDisabled";
