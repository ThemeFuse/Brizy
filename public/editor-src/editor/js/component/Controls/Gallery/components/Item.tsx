import classNames from "classnames";
import { noop } from "es-toolkit";
import React, {
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useCallback
} from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithClassName, WithId } from "visual/types/attributes";

export interface Props<T> extends WithClassName, WithId<T> {
  onRemove?: (id: T) => void;
}

const stopPropagation = (e: MouseEvent<HTMLElement>): void => {
  e.stopPropagation();
};
export function Item<T>({
  id,
  onRemove,
  children,
  className
}: PropsWithChildren<Props<T>>): ReactElement {
  const remove = useCallback(
    () => (onRemove ? onRemove(id) : noop),
    [id, onRemove]
  );

  return (
    <div className={classNames("brz-ed-control__gallery__item", className)}>
      {onRemove && (
        <button
          onMouseDown={stopPropagation}
          onClick={remove}
          className={"brz-ed-control__gallery__item__remove"}
        >
          <EditorIcon
            icon={"nc-circle-remove"}
            className={"brz-ed-control__gallery__item__remove__icon"}
            onClick={remove}
          />
        </button>
      )}
      {children}
    </div>
  );
}
