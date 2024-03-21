import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Input } from "./Input";
import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/utils/options/attributes";
import { mApply } from "visual/utils/value";
import { useDebouncedEffect } from "visual/component/hooks";
import { fromString, Hex } from "visual/utils/color/Hex";

export type Props = WithClassName & WithValue<string> & WithOnChange<Hex>;

export const InputHex = ({
  className,
  value,
  onChange
}: Props): JSX.Element => {
  const [_value, setValue] = useState(value);

  useDebouncedEffect(
    () => {
      if (value !== _value) {
        mApply(onChange, fromString(_value));
      }
    },
    1000,
    [_value]
  );
  useEffect(() => setValue(value), [value]);

  return (
    <Input
      className={classNames("brz-ed-control__input-hex", className)}
      value={_value}
      onChange={setValue}
    />
  );
};
