import classNames from "classnames";
import React, { FC } from "react";
import { AutoCorrectingInput } from "../";
import { StepperProps } from "../types";

export const AutoCorrectingInputStepper: FC<StepperProps> = ({
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
  value,
  stepperSize,
  inputRef,
  handleDecrementCb
}) => (
  <AutoCorrectingInput
    ref={inputRef}
    className={classNames(
      "brz-auto-correcting-input--stepper",
      `brz-auto-correcting-input--stepper-${stepperSize}`,
      className
    )}
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
    handleDecrementCb={handleDecrementCb}
  />
);
