import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import { noop } from "underscore";
import { Item } from "visual/component/Controls/Gallery/types/Item";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithClassName } from "visual/utils/options/attributes";
import { ImageUpload, Props as UploadProps } from "../ImageUpload";
import { Error } from "./components/Error";
import { Loading } from "./components/Loading";
import { Thumbnail } from "./components/Thumbnail";

interface SortableItemProps<T> {
  onRemove?: (id: T) => void;
  item: Item<T>;
}

const SortableItem = function <T extends UniqueIdentifier>({
  item,
  onRemove
}: SortableItemProps<T>) {
  const { active, attributes, listeners, transform, transition, setNodeRef } =
    useSortable({
      id: item.id
    });
  const isActive = active?.id === item.id;
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isActive ? 1 : 0
  };

  const remove = useCallback(
    () => (onRemove ? onRemove(item.id) : noop),
    [item.id, onRemove]
  );

  const renderItem = (item: Item<T>) => {
    switch (item.__type) {
      case "thumbnail":
        return (
          <Thumbnail
            onRemove={onRemove ? remove : undefined}
            id={item.id}
            src={item.payload}
          />
        );
      case "error":
        return <Error onRemove={remove} id={item.id} message={item.payload} />;
      case "loading":
        return <Loading onRemove={remove} id={item.id} />;
    }
  };
  return (
    <div
      className="brz-ed-control__gallery__draggable"
      {...attributes}
      {...listeners}
      style={style}
      ref={setNodeRef}
    >
      {renderItem(item)}
    </div>
  );
};

interface SortableProps<T> extends WithClassName {
  axis?: string;
  items: Item<T>[];
  onAdd: UploadProps["onChange"];
  onRemove?: (id: T) => void;
  onSortEnd: (active: UniqueIdentifier, over: UniqueIdentifier) => void;
}

const Sortable = function <T extends number | string>({
  className,
  items,
  onAdd,
  onRemove,
  onSortEnd
}: SortableProps<T>) {
  const itemsId = items.map((item) => item.id);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active) {
        onSortEnd(active.id, over.id);
      }
    },
    [onSortEnd]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // creates a delay so the click events could trigger
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className={classNames("brz-ed-control__gallery", className)}>
      <DndContext
        onDragEnd={onDragEnd}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <SortableContext items={itemsId}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} onRemove={onRemove} />
          ))}
        </SortableContext>
      </DndContext>
      <ImageUpload
        onChange={onAdd}
        className="brz-ed-control__gallery__item brz-ed-control__gallery__item--add"
      >
        <EditorIcon
          icon="nc-add"
          className="brz-ed-control__gallery__item__icon"
        />
      </ImageUpload>
    </div>
  );
};

export interface Props<T extends number | string> extends WithClassName {
  onSort: (from: number, to: number) => void;
  items: Item<T>[];
  onAdd: UploadProps["onChange"];
  onRemove?: (id: T) => void;
}

export function Gallery<T extends number | string>({
  className,
  items,
  onSort,
  onAdd,
  onRemove
}: Props<T>): ReactElement {
  const _onSort = useCallback(
    (activeId, overId) => {
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      if (oldIndex !== newIndex) {
        onSort(oldIndex, newIndex);
      }
    },
    [onSort, items]
  );
  return (
    <Sortable<T>
      axis="xy"
      onAdd={onAdd}
      onSortEnd={_onSort}
      onRemove={onRemove}
      className={className}
      items={items}
    />
  );
}
