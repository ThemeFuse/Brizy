import React, { ReactElement, useCallback } from "react";
import { last } from "underscore";
import classNames from "classnames";
import {
  MultiSelect,
  Props as MP
} from "visual/component/Controls/MultiSelect";
import { OnChange } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";

type Props<T extends Literal> = Omit<Omit<MP<T>, "onChange">, "value"> & {
  onChange: OnChange<T>;
  value: T;
};

export function Select2<T extends Literal>({
  value,
  onChange,
  children,
  className,
  ...props
}: Props<T>): ReactElement {
  const _value = value !== undefined ? [value] : [];
  const _onChange = useCallback(mCompose(onChange, last), [onChange]);
  return (
    <MultiSelect
      {...props}
      className={classNames(className, "brz-ed-control__select-single")}
      onChange={_onChange}
      value={_value}
      hideSelected={false}
    >
      {children}
    </MultiSelect>
  );
}
