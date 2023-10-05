import classNames from "classnames";
import React, { FC, useCallback } from "react";
import {
  WithClassName,
  WithOnChange,
  WithPlaceholder,
  WithSize,
  WithValue
} from "visual/utils/options/attributes";
import { inputValue } from "visual/utils/react";
import { mCompose } from "visual/utils/value";

export type Props = WithClassName &
  WithValue<string> &
  WithOnChange<string> &
  WithPlaceholder &
  WithSize & {
    rows?: number;
  };

export const Textarea: FC<Props> = ({
  className = "",
  value,
  onChange,
  size = "auto",
  placeholder = "",
  rows = 5
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
