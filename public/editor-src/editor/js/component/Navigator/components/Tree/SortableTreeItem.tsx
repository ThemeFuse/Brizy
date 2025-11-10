import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { CSSProperties, FC, useMemo } from "react";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { TreeItem } from "./TreeItem";
import { TreeItemProps } from "./types";

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging
}) => !(isSorting || wasDragging);

const DISABLED_DRAG_FOR_TYPES = new Set<string>([
  ElementTypes.AccordionItem,
  ElementTypes.Tab,
  ElementTypes.FlipboxItem,
  ElementTypes.SwitcherTab
]);

export const SortableTreeItem: FC<TreeItemProps> = ({
  invalid,
  clone,
  depth,
  item,
  childCount,
  showToggleIcon
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition
  } = useSortable({
    id: item.id,
    animateLayoutChanges,
    disabled: DISABLED_DRAG_FOR_TYPES.has(item.type)
  });

  const style: CSSProperties = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform),
      transition
    }),
    [transform, transition]
  );

  const handleProps = useMemo(
    () => ({
      ...attributes,
      ...listeners
    }),
    [attributes, listeners]
  );

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      ghost={isDragging}
      handleProps={handleProps}
      invalid={invalid}
      clone={clone}
      depth={depth}
      item={item}
      childCount={childCount}
      showToggleIcon={showToggleIcon}
    />
  );
};
