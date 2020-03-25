import React, { ReactElement } from "react";
import classNames from "classnames";
import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/utils/options/attributes";
import { NonEmptyArray } from "visual/utils/array/types";
import { indexOf, nextIndex } from "visual/utils/array";
import { Props as ItemProps } from "./IconToggleItem";

export type Props<T> = WithClassName &
  WithValue<T> &
  WithOnChange<T> & {
    children: NonEmptyArray<ReactElement<ItemProps<T>>>;
  };

export function IconToggle<T>({
  className,
  children,
  value,
  onChange
}: Props<T>): ReactElement<Props<T>> {
  const _className = classNames("brz-ed-control__icon-carousel", className);
  const current = children.find(i => i.props.value === value) ?? children[0];
  const values: T[] = children.map(i => i.props.value);
  const onClick = (): void => {
    const i = indexOf(value, values);
    const j = i !== undefined ? nextIndex(i, values) : undefined;

    j !== undefined && onChange(values[j]);
  };

  return (
    <div className={_className} title={current.props.title} onClick={onClick}>
      {current}
    </div>
  );
}

export default IconToggle;
