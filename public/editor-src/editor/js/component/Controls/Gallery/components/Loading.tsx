import React, { ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithId } from "visual/types/attributes";
import { Item } from "./Item";

export interface Props<T> extends WithId<T> {
  onRemove?: (id: T) => void;
}

export function Loading<T>({ id, onRemove }: Props<T>): ReactElement<Props<T>> {
  return (
    <Item<T>
      className="brz-ed-control__gallery__item--loading"
      id={id}
      onRemove={onRemove}
    >
      <EditorIcon
        icon="nc-circle-02"
        className="brz-ed-animated--spin brz-ed-control__gallery__item__icon"
      />
    </Item>
  );
}
