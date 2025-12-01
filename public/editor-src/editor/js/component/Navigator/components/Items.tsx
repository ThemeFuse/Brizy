import React, { FC, memo, useEffect, useMemo } from "react";
import { shallowEqual, useSelector, useStore } from "react-redux";
import { createSelector } from "reselect";
import { useConfig } from "visual/providers/ConfigProvider";
import { useTreeContext } from "visual/providers/TreeProvider";
import { TreeItems } from "visual/providers/TreeProvider/types";
import {
  globalBlocksIdsInPageSelector,
  pageDataNoRefsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import SortableTree from "./Tree";
import {
  applyCollapsedWithActive,
  buildTree,
  collectVisibilityKey,
  mapCollapsed
} from "./utils";

const blockChangedSelector = createSelector(
  pageDataNoRefsSelector,
  ({ items }) => collectVisibilityKey(items)
);

function useBlockData() {
  const store = useStore<ReduxState>();
  const state = store.getState();

  // We don’t use the key itself.
  // It’s only used to trigger a re-render when items are added or removed,
  // since blocksData changes on each patch, but existing elements updates don’t change the key.
  const key = useSelector(blockChangedSelector, shallowEqual);
  const globalBlocksKeys = useSelector(
    globalBlocksIdsInPageSelector,
    shallowEqual
  );

  // Grab transformed data directly, but without subscribing to redux
  const blocksData = pageDataNoRefsSelector(state);

  return { key, blocksData, globalBlocksKeys };
}

interface Props {
  focusedElementId: string | null;
}

const Items: FC<Props> = ({ focusedElementId }) => {
  const { blocksData, globalBlocksKeys } = useBlockData();
  const { setItems, setActiveId } = useTreeContext();

  const config = useConfig();

  const itemsRoot = useMemo(
    () => buildTree(blocksData.items, config, globalBlocksKeys),
    [blocksData, config, globalBlocksKeys]
  );

  useEffect(() => {
    setItems((prev) => {
      const collapsedById = mapCollapsed(prev as TreeItems);
      return applyCollapsedWithActive(
        itemsRoot,
        collapsedById,
        focusedElementId
      );
    });
  }, [setItems, itemsRoot, focusedElementId]);

  useEffect(() => {
    setActiveId(focusedElementId);
  }, [focusedElementId, setActiveId]);

  return <SortableTree />;
};

export default memo(Items);
