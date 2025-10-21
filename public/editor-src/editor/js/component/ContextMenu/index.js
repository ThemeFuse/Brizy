import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { useContextMenu } from "react-contexify";
import { rolesHOC } from "visual/component/Roles";
import { renderHOC } from "visual/providers/RenderProvider/renderHOC";
import { ContextMenuExtendContext } from "./ContextMenuExtend";
import { Dropdown } from "./Dropdown";
import { ContextMenuContext } from "./context";
import { concatItems, filterItems, mergeItems } from "./utils";

const meta = {
  depth: 0
};

// this component is needed to avoid ContextMenuProvider to render a wrapper div  because that breaks our layout
const ContextMenuWrapper = forwardRef(
  ({ id, children, onContextMenu }, wrapperRef) => {
    const { show } = useContextMenu({ id });

    const handleContextMenu = useCallback(
      (e) => {
        if (!e.shiftKey) {
          const iframe = parent.document.querySelector("#brz-ed-iframe");

          const iframeBounding = iframe.getBoundingClientRect();

          if (onContextMenu) {
            onContextMenu();
          }

          show({
            id,
            event: e,
            position: {
              x: e.clientX + iframeBounding.x,
              y: e.clientY
            }
          });
        }
      },
      [id, onContextMenu]
    );

    useEffect(() => {
      const element = wrapperRef.current;

      if (element) {
        element.addEventListener("contextmenu", handleContextMenu);
      }

      return () => {
        if (element) {
          element.removeEventListener("contextmenu", handleContextMenu);
        }
      };
    }, [id]);

    return children;
  }
);

export const ContextMenuProvider = ({
  getItems: _getItems,
  children,
  id,
  componentId,
  onContextMenu
}) => {
  const ref = useRef(null);
  const rootRef = useRef(null);
  const { getParentContextMenuExtendItems } =
    useContext(ContextMenuExtendContext) ?? {};
  const { getParentContextMenuItems } = useContext(ContextMenuContext) ?? {};

  const getItems = useCallback(() => {
    let items = _getItems();

    items = [
      componentId,
      getParentContextMenuExtendItems
        ? mergeItems(items, getParentContextMenuExtendItems())
        : items
    ];

    if (getParentContextMenuItems) {
      items = [items, ...getParentContextMenuItems()];
    } else {
      items = [items];
    }

    return items;
  }, [
    _getItems,
    getParentContextMenuItems,
    getParentContextMenuExtendItems,
    componentId
  ]);

  const squashItems = useCallback((items) => {
    return items.reduce(
      (acc, [componentId, items]) => {
        if (!acc.componentIdMap[componentId]) {
          acc.componentIdMap[componentId] = true;
          acc.items = concatItems(acc.items, items);
        }

        return acc;
      },
      {
        componentIdMap: {},
        items: []
      }
    ).items;
  }, []);

  const getSquashedItems = useCallback(() => {
    const items = squashItems(getItems());
    return filterItems(items, meta);
  }, [getItems, squashItems]);

  const value = useMemo(
    () => ({
      getParentContextMenuItems: getItems
    }),
    [getItems]
  );

  const root = useMemo(() => {
    if (rootRef.current) {
      return rootRef.current;
    }

    if (typeof window !== "undefined") {
      const rootClassName = "brz-context-menu__root";
      const node = window.parent.document.querySelector(`.${rootClassName}`);

      if (node) {
        rootRef.current = node;
        return node;
      }

      const root = document.createElement("div");
      root.className = rootClassName;
      rootRef.current = root;
      window.parent.document.body.appendChild(root);
      return root;
    }
  }, []);

  return (
    <ContextMenuContext.Provider value={value}>
      <ContextMenuWrapper id={id} ref={ref} onContextMenu={onContextMenu}>
        {typeof children === "function" ? children({ ref }) : children}
      </ContextMenuWrapper>
      {root && (
        <Dropdown
          id={id}
          getItems={getSquashedItems}
          itemsMeta={meta}
          root={root}
        />
      )}
    </ContextMenuContext.Provider>
  );
};

export default rolesHOC({
  allow: ["admin"],
  component: renderHOC({
    ForEdit: ContextMenuProvider,
    ForView: ({ children }) => (
      <>{typeof children === "function" ? children({}) : children}</>
    )
  }),
  fallbackComponent: ({ children }) => children
});

export { default as ContextMenuExtend } from "./ContextMenuExtend";
export { default as ContextMenuDisabled } from "./ContextMenuDisabled";
