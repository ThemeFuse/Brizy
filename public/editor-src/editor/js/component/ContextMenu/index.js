import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { contextMenu } from "react-contexify";
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
const ContextMenuWrapper = forwardRef(({ id, children }, wrapperRef) => {
  const handleContextMenu = useCallback(
    (e) => {
      if (!e.shiftKey) {
        contextMenu.show({
          id,
          event: e
        });
      }
    },
    [id]
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
});

export const ContextMenuProvider = ({
  getItems: _getItems,
  children,
  id,
  componentId
}) => {
  const ref = useRef(null);
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

  return (
    <ContextMenuContext.Provider value={value}>
      <ContextMenuWrapper id={id} ref={ref}>
        {typeof children === "function" ? children({ ref }) : children}
      </ContextMenuWrapper>
      <Dropdown id={id} getItems={getSquashedItems} itemsMeta={meta} />
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
