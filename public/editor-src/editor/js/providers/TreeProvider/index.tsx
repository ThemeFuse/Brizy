import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { useDispatch, useStore } from "react-redux";
import { useConfig } from "visual/providers/ConfigProvider";
import { removeBlock, updateBlocks } from "visual/redux/actions2";
import {
  blocksOrderSelector,
  globalBlocksSelector,
  pageDataNoRefsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types/Block";
import { TreeContext } from "./context";
import { TreeContextType, TreeItems } from "./types";
import {
  checkForGlobalBlockChanges,
  getCurrentWrapperElementId,
  removeBlockWithWrapper,
  setAll,
  setHiddenElement,
  setProperty,
  updateBlockTitle,
  updateGlobalBlocksOnChange
} from "./utils";

export const TreeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<TreeItems>([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const store = useStore<ReduxState>();
  const dispatch = useDispatch();
  const config = useConfig();

  const collapseAll = useCallback(() => {
    setItems((items) => setAll(items, "collapsed", true));
    setAllExpanded(false);
  }, []);

  const expandAll = useCallback(() => {
    setItems((items) => setAll(items, "collapsed", false));
    setAllExpanded(true);
  }, []);

  const toggleExpandAll = useCallback(() => {
    if (allExpanded) {
      return collapseAll();
    }

    expandAll();
  }, [collapseAll, expandAll, allExpanded]);

  const toggleExpand = useCallback((id: string) => {
    setItems((items) =>
      setProperty(items, id, "collapsed", (value) => {
        return !value;
      })
    );
  }, []);

  const toggleShowElement = useCallback(
    (id: string) => {
      const data = pageDataNoRefsSelector(store.getState());
      const blocks = setHiddenElement(data.items, id) as Block[];
      const globalBlocks = globalBlocksSelector(store.getState());

      // Check if changes affect global blocks first
      const affectedGlobalBlock = checkForGlobalBlockChanges(
        blocks,
        Object.keys(globalBlocks),
        id
      );

      if (affectedGlobalBlock) {
        // Only dispatch global block updates with pre-identified IDs
        updateGlobalBlocksOnChange(
          affectedGlobalBlock,
          globalBlocks,
          config,
          dispatch
        );
      } else {
        // Only dispatch regular block updates
        dispatch(updateBlocks({ blocks, meta: {}, config }));
      }
    },

    [config, dispatch, store]
  );

  const handleClickItem = useCallback(
    (id: string) => {
      const blocks = pageDataNoRefsSelector(store.getState());
      const currentWrapperId = getCurrentWrapperElementId(blocks.items, id);

      let element = currentWrapperId
        ? document.getElementById(currentWrapperId)
        : null;

      if (element) {
        const sliderWrapper = element.closest(".slick-slider");

        if (sliderWrapper) {
          element = sliderWrapper.querySelector(
            `.slick-active [id=${currentWrapperId}]`
          );
        }

        element?.scrollIntoView({ behavior: "smooth", block: "center" });

        // Activate the element by clicking it, which also displays its ContainerBorder
        element?.click();
      }
      setActiveId(id);
    },
    [store]
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      const state = store.getState();
      const blocksOrder = blocksOrderSelector(state);
      const blockIndex = blocksOrder.findIndex((blockId) => blockId === id);

      // Check if the item is a top-level block
      if (blockIndex !== -1) {
        // It's a block, use the removeBlock action
        dispatch(removeBlock({ index: blockIndex, id, config }));
      } else {
        // It's not a block, use the existing logic with removeBlockWithWrapper
        const blocks = pageDataNoRefsSelector(state);
        const globalBlocks = globalBlocksSelector(state);

        // Check if changes affect global blocks BEFORE removing the block
        const affectedGlobalBlock = checkForGlobalBlockChanges(
          blocks.items,
          Object.keys(globalBlocks),
          id
        );

        const changedBlocks = removeBlockWithWrapper(blocks.items, id);
        const globalAffectedBlock = changedBlocks.find(
          (block) => block.value._id === affectedGlobalBlock?.value._id
        );

        if (globalAffectedBlock) {
          // Only dispatch global block updates with pre-identified IDs
          updateGlobalBlocksOnChange(
            globalAffectedBlock,
            globalBlocks,
            config,
            dispatch
          );
        } else {
          // Only dispatch regular block updates
          dispatch(updateBlocks({ blocks: changedBlocks, meta: {}, config }));
        }
      }
    },
    [config, dispatch, store]
  );

  const updateItemTitle = useCallback(
    (id: string, title: string) => {
      const state = store.getState();
      const blocks = pageDataNoRefsSelector(state);
      const globalBlocks = globalBlocksSelector(state);
      const originalBlocks = blocks.items;
      const updatedBlocks = updateBlockTitle(originalBlocks, id, title);

      // Check if changes affect global blocks first
      const affectedGlobalBlock = checkForGlobalBlockChanges(
        updatedBlocks,
        Object.keys(globalBlocks),
        id,
        originalBlocks
      );

      if (affectedGlobalBlock) {
        // Only dispatch global block updates with pre-identified IDs
        updateGlobalBlocksOnChange(
          affectedGlobalBlock,
          globalBlocks,
          config,
          dispatch
        );
      } else {
        // Only dispatch regular block updates
        dispatch(updateBlocks({ blocks: updatedBlocks, meta: {}, config }));
      }
    },
    [store, config, dispatch]
  );

  const value = useMemo(
    () => ({
      activeId,
      toggleExpandAll,
      allExpanded,
      toggleExpand,
      items,
      setItems,
      toggleShowElement,
      onClickItem: handleClickItem,
      onRemoveItem: handleRemoveItem,
      setActiveId,
      updateItemTitle
    }),
    [
      toggleExpandAll,
      allExpanded,
      toggleExpand,
      items,
      toggleShowElement,
      handleClickItem,
      activeId,
      handleRemoveItem,
      updateItemTitle
    ]
  );

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
};

export const useTreeContext = (): TreeContextType => {
  const context = useContext(TreeContext);

  if (context === null) {
    throw new Error("useTreeContext must be used inside TreeContextProvider");
  }

  return context;
};
