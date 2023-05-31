import classNames from "classnames";
import React, { FC, useCallback } from "react";
import { Props } from "./types";

export const Input: FC<Props> = ({
  className,
  value,
  onChange,
  onBlur,
  size = "auto",
  placeholder
}) => {
  const _className = classNames(
    "brz-ed-control__input2",
    className,
    `brz-ed-control__input2--${size}`
  );
  const handleChange = useCallback(
    ({ target }) => onChange(target.value),
    [onChange]
  );

  return (
    <div className={_className}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={onBlur}
      />
    </div>
  );
};
