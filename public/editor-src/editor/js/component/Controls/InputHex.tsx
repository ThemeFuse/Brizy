import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useDebouncedEffect } from "visual/component/hooks";
import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/types/attributes";
import { fromString, Hex } from "visual/utils/color/Hex";
import { mApply } from "visual/utils/value";
import { Input } from "./Input";

export type Props = WithClassName & WithValue<string> & WithOnChange<Hex>;

const formatHexValue = (inputValue: string) => {
  const formattedValue = inputValue.replace(/#/g, "");
  return `#${formattedValue}`;
};

export const InputHex = ({
  className,
  value,
  onChange
}: Props): React.JSX.Element => {
  const [_value, setValue] = useState(() => formatHexValue(value));

  useDebouncedEffect(
    () => {
      if (value !== _value) {
        mApply(onChange, fromString(_value));
      }
    },
    1000,
    [_value]
  );

  useEffect(() => {
    setValue(formatHexValue(value));
  }, [value]);

  const handleInputChange = (inputValue: string) => {
    setValue(formatHexValue(inputValue));
  };

  return (
    <Input
      className={classNames("brz-ed-control__input-hex", className)}
      value={_value}
      onChange={handleInputChange}
    />
  );
};
