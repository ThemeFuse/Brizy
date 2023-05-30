import classNames from "classnames";
import React, { FC } from "react";
import { AutoCorrectingInput } from "../";
import { CommonProps } from "../types";

export const AutoCorrectingInputWidth: FC<CommonProps> = ({
  className,
  min,
  max,
  step,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  size,
  onChange,
  onTextChange,
  value
}) => (
  <AutoCorrectingInput
    className={classNames("brz-auto-correcting-input--width", className)}
    min={min}
    max={max}
    step={step}
    onFocus={onFocus}
    onBlur={onBlur}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    size={size}
    onChange={onChange}
    onTextChange={onTextChange}
    value={value}
  />
);
