import React, { ReactElement } from "react";
import Tooltip from "visual/component/Controls/Tooltip";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithId } from "visual/types/attributes";
import { Item } from "./Item";

export interface Props<T> extends WithId<T> {
  message: string;
  onRemove?: (id: T) => void;
}

export function Error<T>({
  id,
  onRemove,
  message
}: Props<T>): ReactElement<Props<T>> {
  return (
    <Tooltip
      overlay={<div>{message}</div>}
      openOnClick={false}
      className="brz-ed-control__gallery-tooltip--error"
    >
      <Item<T>
        className="brz-ed-control__gallery__item--error"
        id={id}
        onRemove={onRemove}
      >
        <EditorIcon
          icon="nc-warning"
          className={"brz-ed-control__gallery__item__icon"}
        />
      </Item>
    </Tooltip>
  );
}
