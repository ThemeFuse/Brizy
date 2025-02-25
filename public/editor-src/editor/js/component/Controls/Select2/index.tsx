import classNames from "classnames";
import { last } from "es-toolkit";
import React, { ReactElement, useCallback } from "react";
import { OnChange } from "visual/component/Options/Type";
import { Position } from "visual/utils/position/Position";
import { Literal } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";
import { Props as MP, Select } from "./Select";

type Props<T extends Literal> = Omit<MP<T>, "value" | "onChange"> & {
  value: T;
  onChange: OnChange<T>;
  maxHeight?: number;
  positionDropdown?: Position;
};

export function Select2<T extends Literal>({
  value,
  onChange,
  children,
  className,
  maxHeight,
  positionDropdown,
  ...props
}: Props<T>): ReactElement {
  const _value = value !== undefined ? [value] : [];
  const _onChange = useCallback(
    (v: Array<T>) => mCompose(onChange, last)(v),
    [onChange]
  );

  return (
    <Select<T>
      {...props}
      className={classNames(className, "brz-ed-control__select-single")}
      onChange={_onChange}
      value={_value}
      hideSelected={false}
      maxHeight={maxHeight}
      positionDropdown={positionDropdown}
    >
      {children}
    </Select>
  );
}
