import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useDndMonitor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { deviceModeSelector } from "visual/redux/selectors-new";
import type { OptionGroup, SortableGroupProps, SortableProps } from "../types";
import { getGroupsOrder } from "../utils";
import { Group } from "./Group";

export function Sortable({
  activeGroup,
  optionGroups,
  onRemove,
  onDragEnd,
  onRename,
  setActiveGroup,
  toolbar,
  overlayRenderNode
}: SortableProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const overlayGroup: OptionGroup | null = useMemo(() => {
    if (!activeGroup) {
      return null;
    }
    return optionGroups.find(({ id }) => id === activeGroup.groupId) ?? null;
  }, [activeGroup, optionGroups]);

  return (
    <DndContext
      onDragEnd={onDragEnd}
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={getGroupsOrder(optionGroups)}
        strategy={verticalListSortingStrategy}
      >
        {optionGroups.map((group) => {
          const { id, title, options } = group;
          return (
            <SortableGroup
              groupId={id}
              key={id}
              title={title}
              options={options}
              toolbar={toolbar}
              onRemove={onRemove}
              onRename={onRename}
              setActiveGroup={setActiveGroup}
              overlayRenderNode={overlayRenderNode}
            />
          );
        })}
      </SortableContext>

      {createPortal(
        <DragOverlay className="brz-ed-addable__drag_overlay">
          {overlayGroup && (
            <Group
              options={overlayGroup.options}
              title={overlayGroup.title}
              isOpen={activeGroup?.isOpen}
              isActive
            />
          )}
        </DragOverlay>,
        overlayRenderNode
      )}
    </DndContext>
  );
}

export function SortableGroup({
  groupId,
  setActiveGroup,
  onRemove,
  onRename,
  overlayRenderNode,
  ...props
}: SortableGroupProps) {
  const dragDisabled = useSelector(deviceModeSelector) !== "desktop";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: groupId,
    disabled: dragDisabled
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleRemove = useCallback(() => {
    onRemove(groupId);
  }, [groupId, onRemove]);

  const handleRename = useCallback(
    (title: string) => {
      onRename({ groupId, title });
    },
    [onRename, groupId]
  );

  const iframe = useMemo(
    () =>
      overlayRenderNode.querySelector<HTMLIFrameElement>(
        ".brz.brz-ed .brz-iframe"
      ),
    [overlayRenderNode]
  );

  useDndMonitor({
    onDragStart(event: DragStartEvent) {
      iframe?.classList.add("brz-blocked");
      if (event.active.id === groupId) {
        setActiveGroup?.({ groupId, isOpen });
      }
    },
    onDragEnd() {
      iframe?.classList.remove("brz-blocked");
    }
  });

  const style = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform),
      transition,
      ...(isDragging ? { opacity: 0.4 } : {})
    }),
    [isDragging, transform, transition]
  );

  return (
    <Group
      ref={setNodeRef}
      style={style}
      isOpen={isOpen}
      dragDisabled={dragDisabled}
      listeners={listeners}
      onOpen={handleIsOpen}
      onRemove={handleRemove}
      onRename={handleRename}
      {...attributes}
      {...props}
    />
  );
}
