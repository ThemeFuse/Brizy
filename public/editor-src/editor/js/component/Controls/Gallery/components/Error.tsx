import React, { ReactElement } from "react";
import { Item } from "./Item";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithId } from "visual/utils/options/attributes";
import Tooltip from "visual/component/Controls/Tooltip";

export interface Props<T> extends WithId<T> {
  message: string;
  onRemove: (id: T) => void;
}

export function Error<T>({
  id,
  onRemove,
  message
}: Props<T>): ReactElement<Props<T>> {
  return (
    <Tooltip overlay={<div>{message}</div>} openOnClick={true}>
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
