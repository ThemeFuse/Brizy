import classnames from "classnames";
import React, { FC, useEffect, useState } from "react";
import { Input } from "../Input";
import { useDebouncedEffect } from "../hooks";
import { fromString, mApply } from "../utils/value";
import { Props } from "./types";

export const InputHex: FC<Props> = ({ className, value, onChange }) => {
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
  const _className = classnames("brz-ed-control__input-hex", className);
  return <Input className={_className} value={_value} onChange={setValue} />;
};
