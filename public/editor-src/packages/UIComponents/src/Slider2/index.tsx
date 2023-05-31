import classNames from "classnames";
import React, { FC, useCallback } from "react";
import { read } from "../utils/math/number";
import { inputValue } from "../utils/react";
import { mCompose } from "../utils/value";
import { Props } from "./types";

export const Slider2: FC<Props> = ({
  value,
  onChange,
  className,
  min,
  max,
  step
}) => {
  const inputClassName = classNames(
    "brz-input brz-ed-control--slider2",
    className
  );
  const _onChange = useCallback(
    (v) => mCompose((v) => onChange(v, { editing: true }), read, inputValue)(v),
    [onChange]
  );
  const _onMouseUp = useCallback(
    (v) =>
      mCompose((v) => onChange(v, { editing: false }), read, inputValue)(v),
    [onChange]
  );

  return (
    <input
      className={inputClassName}
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={_onChange}
      onMouseUp={_onMouseUp}
    />
  );
};
