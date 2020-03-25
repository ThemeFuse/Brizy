import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { mCompose } from "visual/utils/value";
import { inputValue } from "visual/utils/react";
import {
  WithClassName,
  WithOnChange,
  WithPlaceholder,
  WithSize,
  WithValue
} from "visual/utils/options/attributes";

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
  const _onChange = useCallback(mCompose(onChange, inputValue), [value]);

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
