import classNames from "classnames";
import React, { FC, useCallback } from "react";
import { inputValue } from "../utils/react";
import { mCompose } from "../utils/value";
import { Props } from "./types";

export const Textarea: FC<Props> = ({
  className,
  value,
  onChange,
  size,
  placeholder,
  rows
}) => {
  const baseClass = "brz-ed-control__textarea2";
  const _className = classNames(baseClass, className, `${baseClass}--${size}`);
  const _onChange = useCallback(
    (v) => mCompose(onChange, inputValue)(v),
    [onChange]
  );

  return (
    <textarea
      rows={rows}
      className={_className}
      value={value}
      placeholder={placeholder}
      onChange={_onChange}
    />
  );
};
