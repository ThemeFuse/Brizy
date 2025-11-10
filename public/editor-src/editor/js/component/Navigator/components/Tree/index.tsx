import { Str } from "@brizy/readers";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
  closestCenter,
  defaultDropAnimation
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { isEqual } from "es-toolkit";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useDispatch, useStore } from "react-redux";
import Portal from "visual/component/Portal";
import { Scrollbar } from "visual/component/Scrollbar";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { useConfig } from "visual/providers/ConfigProvider";
import { useTreeContext } from "visual/providers/TreeProvider";
import {
  checkForGlobalBlockChanges,
  updateGlobalBlocksOnChange
} from "visual/providers/TreeProvider/utils";
import { reorderBlocks, updateBlocks } from "visual/redux/actions2";
import {
  globalBlocksSelector,
  pageDataNoRefsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types/Block";
import { hasVisibleChildren } from "../utils";
import { SortableTreeItem } from "./SortableTreeItem";
import {
  FlattenedItem,
  SECTION_TYPES,
  buildTree,
  checkForSectionLevelReorder,
  computeOverIndex,
  findFlatById,
  findItemDeep,
  flattenForRender,
  flattenTree,
  getChildCount,
  getProjection,
  handleSpecialCases,
  isDescendantOf,
  isValidParentForChild,
  mergeBlocks,
  normalizeSectionParent,
  removeChildrenOf,
  resolveMoveNode,
  treeToBlocks,
  validatePlacement
} from "./utils";

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5
        })
      }
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing
    });
  }
};

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always
  }
};

const SortableTree = () => {
  const { items } = useTreeContext();
  const store = useStore<ReduxState>();
  const dispatch = useDispatch();
  const config = useConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const flattenedVisibleItems = useMemo(() => {
    const flattenedTree = flattenForRender(items);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId != null ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);
  // Full flattened list (includes invisible nodes) used for commit of order
  const flattenedAllItems = useMemo(() => flattenTree(items), [items]);
  const projected =
    activeId && overId
      ? getProjection(flattenedVisibleItems, activeId, overId, offsetLeft)
      : null;

  const sensorContext = useRef({
    items: flattenedVisibleItems,
    offset: offsetLeft
  });

  const sortedIds = useMemo(
    () => flattenedVisibleItems.map(({ id }) => id),
    [flattenedVisibleItems]
  );
  const activeItem = activeId
    ? flattenedVisibleItems.find(({ id }) => id === activeId)
    : null;

  const isInvalidOver = useMemo(() => {
    if (!activeId || !overId || !projected) return false;
    const source = flattenedVisibleItems.find(({ id }) => id === activeId);
    if (!source) return false;
    const parentId = projected.parentId;
    const parentType = parentId
      ? (findItemDeep(items, parentId)?.type ?? null)
      : null;

    // Prevent dragging directly into SectionHeader (only SectionHeaderItem and SectionHeaderStickyItem allowed)
    if (parentType === ElementTypes.SectionHeader) {
      return true;
    }

    // Sections cannot be nested
    if (SECTION_TYPES.has(source.type) && parentType !== null) return true;
    // Validate parent->child relationship
    return !isValidParentForChild(parentType, source.type);
  }, [activeId, overId, projected, flattenedVisibleItems, items]);

  useEffect(() => {
    sensorContext.current = {
      items: flattenedVisibleItems,
      offset: offsetLeft
    };
  }, [flattenedVisibleItems, offsetLeft]);

  const handleDragStart = useCallback(
    ({ active: { id: activeId } }: DragStartEvent) => {
      const id = Str.read(activeId) ?? null;
      setActiveId(id);
      setOverId(id);
    },
    []
  );

  const handleDragMove = useCallback(({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
    setDragOffset(delta.y);
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setOverId(Str.read(over?.id) ?? null);
  }, []);

  const resetState = useCallback(() => {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setDragOffset(0);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      resetState();

      if (!projected || !over) return;

      // 1) Basics and data maps
      let { depth, parentId } = projected;
      const allFlat = flattenedAllItems;
      const allById = new Map(allFlat.map((n) => [n.id, n]));
      const clonedItems: FlattenedItem[] = allFlat.map((n) => ({ ...n }));

      // 2) Resolve actual node to move (container for simple elements)
      const sourceNode = allById.get(String(active.id)) ?? null;
      if (!sourceNode) return;
      const moveNode = resolveMoveNode(sourceNode, allById);

      // 3) Decide final parent/depth
      const moveNodeParentId = moveNode.parentId ?? null;
      const parentDepth = findFlatById(allById, parentId)?.depth ?? -1;
      if (moveNode.id !== sourceNode.id) {
        if (parentId === moveNodeParentId) {
          parentId = moveNodeParentId;
          depth = moveNode.depth;
        } else {
          depth = parentDepth + 1;
        }
      }

      // Normalize Section parent to SectionItem (and adjust depth if needed)
      const normalized = normalizeSectionParent(parentId, allById);
      parentId = normalized.parentId;
      if (typeof normalized.depth === "number") depth = normalized.depth;

      // Prevent self-parenting
      if (parentId === moveNode.id) {
        parentId = moveNode.parentId ?? null;
        depth = moveNode.depth;
      }

      // 4) Prevent dragging directly into SectionHeader (only SectionHeaderItem and SectionHeaderStickyItem allowed)
      const parentNode = parentId ? allById.get(parentId) : null;
      if (parentNode?.type === ElementTypes.SectionHeader) {
        return;
      }

      // 5) Validate types
      if (!validatePlacement(items, parentId, moveNode.type)) return;

      // 6) Compute correct drop index among siblings in target parent scope
      // Find the "over" node constrained to the target parent chain to avoid dropping into descendants
      const getAncestorWithParent = (
        startId: string,
        targetParentId: string | null
      ): FlattenedItem | null => {
        let node: FlattenedItem | null = allById.get(startId) ?? null;
        while (node && node.parentId !== targetParentId) {
          node = node.parentId ? (allById.get(node.parentId) ?? null) : null;
        }
        return node;
      };
      const overForTarget = over.id
        ? getAncestorWithParent(String(over.id), parentId)
        : null;
      if (
        overForTarget &&
        isDescendantOf(allById, moveNode.id, overForTarget.id)
      )
        return;

      const activeIndex = clonedItems.findIndex(({ id }) => id === moveNode.id);
      if (activeIndex === -1) return;
      const overIndex = computeOverIndex(
        clonedItems,
        parentId,
        overForTarget ? overForTarget.id : String(over.id)
      );

      // 7) Handle special cases (e.g., Column moved to Section needs Row wrapper)
      const specialCaseResult = handleSpecialCases(
        clonedItems,
        moveNode,
        parentId,
        depth,
        overIndex,
        activeIndex,
        allById,
        dragOffset
      );

      // 8) Commit
      clonedItems[specialCaseResult.finalActiveIndex] = {
        ...clonedItems[specialCaseResult.finalActiveIndex],
        depth: specialCaseResult.finalDepth,
        parentId:
          specialCaseResult.newElementId ?? specialCaseResult.finalParentId
      };

      // Use arrayMove only if not skipped by special case handling
      const sortedItems = specialCaseResult.skipArrayMove
        ? specialCaseResult.clonedItems
        : arrayMove(
            specialCaseResult.clonedItems,
            specialCaseResult.finalActiveIndex,
            specialCaseResult.finalOverIndex
          );
      const newItems = buildTree(sortedItems);
      const newBlocks = treeToBlocks(
        newItems,
        undefined,
        specialCaseResult.newElementId
      );
      const pageData = pageDataNoRefsSelector(store.getState()).items;
      const globalBlocks = globalBlocksSelector(store.getState());

      const blocks = mergeBlocks(pageData, newBlocks);

      if (isEqual(pageData, blocks)) {
        return;
      }

      // Check if we are reordering section level blocks
      const isSectionLevelReorder = checkForSectionLevelReorder(
        moveNode,
        specialCaseResult.finalActiveIndex,
        specialCaseResult.finalOverIndex,
        clonedItems
      );

      if (isSectionLevelReorder) {
        const oldIndex = pageData.findIndex(
          (block: Block) => block.value._id === moveNode.id
        );
        const newIndex = pageData.findIndex(
          (block: Block) => block.value._id === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          // For section level reordering, use reorderBlocks action
          return dispatch(
            reorderBlocks({
              oldIndex: oldIndex,
              newIndex: newIndex,
              config
            })
          );
        }
      }

      const affectedGlobalBlock = checkForGlobalBlockChanges(
        blocks,
        Object.keys(globalBlocks),
        specialCaseResult.newElementId ?? active.id.toString(),
        pageData
      );

      if (affectedGlobalBlock) {
        updateGlobalBlocksOnChange(
          affectedGlobalBlock,
          globalBlocks,
          config,
          dispatch
        );
      }

      dispatch(updateBlocks({ blocks, meta: {}, config }));
    },
    [
      resetState,
      projected,
      flattenedAllItems,
      items,
      store,
      dispatch,
      config,
      dragOffset
    ]
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={resetState}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <Scrollbar theme="dark">
          <ul className="brz-navigator-list">
            {flattenedVisibleItems.map((item) => (
              <SortableTreeItem
                key={item.id}
                depth={
                  item.id === activeId && projected
                    ? projected.depth
                    : item.depth
                }
                item={item}
                invalid={item.id === overId && isInvalidOver}
                showToggleIcon={hasVisibleChildren(item)}
              />
            ))}
          </ul>
        </Scrollbar>
        <Portal node={window?.parent?.document.body}>
          <DragOverlay dropAnimation={dropAnimationConfig} zIndex={1100}>
            {activeId && activeItem ? (
              <SortableTreeItem
                depth={activeItem.depth}
                clone
                item={activeItem}
                childCount={getChildCount(items, activeItem.id) + 1}
                invalid={isInvalidOver}
                showToggleIcon={hasVisibleChildren(activeItem)}
              />
            ) : null}
          </DragOverlay>
        </Portal>
      </SortableContext>
    </DndContext>
  );
};

export default memo(SortableTree);
