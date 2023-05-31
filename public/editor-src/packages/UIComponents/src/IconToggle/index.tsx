import classNames from "classnames";
import React, { ReactElement } from "react";
import { indexOf, nextIndex } from "../utils/array";
import { Props } from "./types";

export function IconToggle<T>({
  className,
  children,
  value,
  onChange
}: Props<T>): ReactElement<Props<T>> {
  const _className = classNames("brz-ed-control__icon-carousel", className);
  const current = children.find((i) => i.props.value === value) ?? children[0];
  const values: T[] = children.map((i) => i.props.value);

  const onClick = (): void => {
    const currentIdx = indexOf(value, values);
    const nextIdx =
      currentIdx !== undefined ? nextIndex(currentIdx, values) : undefined;

    nextIdx !== undefined && onChange(values[nextIdx]);
  };

  return (
    <div className={_className} title={current.props.title} onClick={onClick}>
      {current}
    </div>
  );
}
