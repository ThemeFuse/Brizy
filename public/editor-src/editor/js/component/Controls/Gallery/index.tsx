import React, { ReactElement, useCallback } from "react";
import classNames from "classnames";
import {
  SortableContainer,
  SortableElement,
  SortEndHandler
} from "react-sortable-hoc";
import { Loading } from "./components/Loading";
import { Thumbnail } from "./components/Thumbnail";
import { Error } from "./components/Error";
import { WithClassName } from "visual/utils/options/attributes";
import { Item } from "visual/component/Controls/Gallery/types/Item";
import { ImageUpload, Props as UploadProps } from "../ImageUpload";
import { EditorIcon } from "visual/component/EditorIcon";

interface SortableItemProps<T> {
  onRemove: (id: T) => void;
  item: Item<T>;
}

const SortableItem = SortableElement(function<T>({
  item,
  onRemove
}: SortableItemProps<T>) {
  const remove = useCallback(() => onRemove(item.id), [item.id, onRemove]);
  switch (item.__type) {
    case "thumbnail":
      return (
        <div className="brz-ed-control__gallery__draggable">
          <Thumbnail onRemove={remove} id={item.id} src={item.payload} />
        </div>
      );
    case "error":
      return (
        <div className="brz-ed-control__gallery__draggable">
          <Error onRemove={remove} id={item.id} message={item.payload} />
        </div>
      );
    case "loading":
      return (
        <div className="brz-ed-control__gallery__draggable">
          <Loading onRemove={remove} id={item.id} />
        </div>
      );
  }
});

interface SortableProps<T> extends WithClassName {
  items: Item<T>[];
  onAdd: UploadProps["onChange"];
  onRemove: (id: T) => void;
  allowedExtensions: UploadProps["allowedExtensions"];
}
const Sortable = SortableContainer(function<T extends number | string>({
  allowedExtensions,
  items,
  onAdd,
  onRemove,
  className
}: SortableProps<T>) {
  return (
    <div className={classNames("brz-ed-control__gallery", className)}>
      {items.map((item, i) => (
        // @ts-expect-error: Type 'unknown' is not assignable to type 'T'.
        <SortableItem key={item.id} index={i} item={item} onRemove={onRemove} />
      ))}
      <ImageUpload
        onChange={onAdd}
        allowedExtensions={allowedExtensions}
        className={
          "brz-ed-control__gallery__item brz-ed-control__gallery__item--add"
        }
      >
        <EditorIcon
          icon="nc-add"
          className={"brz-ed-control__gallery__item__icon"}
        />
      </ImageUpload>
    </div>
  );
});

export interface Props<T extends number | string> extends WithClassName {
  onSort: (from: number, to: number) => void;
  items: Item<T>[];
  onAdd: UploadProps["onChange"];
  onRemove: (id: T) => void;
  allowedExtensions: UploadProps["allowedExtensions"];
}

export function Gallery<T extends number | string>({
  className,
  items,
  onSort,
  onAdd,
  onRemove,
  allowedExtensions
}: Props<T>): ReactElement {
  const _onSort = useCallback<SortEndHandler>(
    ({ oldIndex, newIndex }) => onSort(oldIndex, newIndex),
    [onSort]
  );
  return (
    <Sortable
      axis={"xy"}
      allowedExtensions={allowedExtensions}
      onAdd={onAdd}
      onSortEnd={_onSort}
      // @ts-expect-error: Type 'string | number' is not assignable to type 'T'
      onRemove={onRemove}
      className={className}
      items={items}
    />
  );
}
