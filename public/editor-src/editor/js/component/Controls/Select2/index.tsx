import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import { last } from "underscore";
import { OnChange } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";
import { Props as MP, Select } from "./Select";

type Props<T extends Literal> = Omit<MP<T>, "value" | "onChange"> & {
  value: T;
  onChange: OnChange<T>;
};

export function Select2<T extends Literal>({
  value,
  onChange,
  children,
  className,
  ...props
}: Props<T>): ReactElement {
  const _value = value !== undefined ? [value] : [];
  const _onChange = useCallback((v) => mCompose(onChange, last)(v), [onChange]);

  return (
    <Select<T>
      {...props}
      className={classNames(className, "brz-ed-control__select-single")}
      onChange={_onChange}
      value={_value}
      hideSelected={false}
    >
      {children}
    </Select>
  );
}
